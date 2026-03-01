// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StreamPay {

    enum CurveType { Linear, Exponential, Sigmoid }

    struct Stream {
        address sender;
        address recipient;
        address token;
        uint256 deposit;     // total locked
        uint256 withdrawn;   // already claimed by recipient
        uint256 startTime;
        uint256 stopTime;
        CurveType curveType;
        bool active;
    }

    // PVM Math Extension Precompile Address
    address constant PVM_MATH_EXTENSION = address(0x0000000000000000000000000000000000000501);

    uint256 public nextStreamId = 1;

    mapping(uint256 => Stream) public streams;
    mapping(address => uint256[]) public outgoing;   // sender  → stream ids
    mapping(address => uint256[]) public incoming;   // recipient → stream ids

    event StreamCreated(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        address token,
        uint256 deposit,
        uint256 startTime,
        uint256 stopTime,
        CurveType curveType
    );
    event Withdrawn(uint256 indexed id, uint256 amount);
    event Cancelled(uint256 indexed id, uint256 toRecipient, uint256 toSender);

    // -------- create --------

    function createStream(
        address recipient,
        uint256 startTime,
        uint256 stopTime,
        CurveType curveType
    ) external payable returns (uint256 streamId) {
        uint256 deposit = msg.value;

        require(recipient != address(0) && recipient != msg.sender, "bad recipient");
        require(deposit > 0, "zero deposit");
        require(startTime >= block.timestamp, "start in past");
        require(stopTime > startTime, "stop <= start");
        require(deposit >= (stopTime - startTime), "deposit < duration");

        streamId = nextStreamId++;
        streams[streamId] = Stream({
            sender:    msg.sender,
            recipient: recipient,
            token:     address(0),
            deposit:   deposit,
            withdrawn: 0,
            startTime: startTime,
            stopTime:  stopTime,
            curveType: curveType,
            active:    true
        });

        outgoing[msg.sender].push(streamId);
        incoming[recipient].push(streamId);

        emit StreamCreated(streamId, msg.sender, recipient, address(0), deposit, startTime, stopTime, curveType);
    }

    // -------- read balances --------

    function streamBalance(uint256 id)
        public view returns (uint256 recipientBal, uint256 senderBal)
    {
        Stream storage s = streams[id];
        if (!s.active) return (0, 0);

        uint256 elapsed;
        if (block.timestamp <= s.startTime) {
            elapsed = 0;
        } else if (block.timestamp >= s.stopTime) {
            elapsed = s.stopTime - s.startTime;
        } else {
            elapsed = block.timestamp - s.startTime;
        }

        uint256 duration   = s.stopTime - s.startTime;
        uint256 earned;

        if (s.curveType != CurveType.Linear) {
            // Attempt to call the PVM Math Extension
            (bool ok, bytes memory data) = PVM_MATH_EXTENSION.staticcall(
                abi.encodeWithSignature("calculateEarned(uint256,uint256,uint256,uint8)", 
                s.deposit, elapsed, duration, uint8(s.curveType))
            );
            
            if (ok && data.length == 32) {
                earned = abi.decode(data, (uint256));
            } else {
                earned = (s.deposit * elapsed) / duration;
            }
        } else {
            earned = (s.deposit * elapsed) / duration;
        }

        recipientBal       = earned - s.withdrawn;
        senderBal          = s.deposit - earned;
    }

    // -------- withdraw --------

    function withdraw(uint256 id) external {
        Stream storage s = streams[id];
        require(s.active, "inactive");
        require(msg.sender == s.recipient, "not recipient");

        (uint256 available, ) = streamBalance(id);
        require(available > 0, "nothing to withdraw");

        s.withdrawn += available;

        (bool ok, ) = payable(s.recipient).call{value: available}("");
        require(ok, "native transfer failed");

        if (s.withdrawn >= s.deposit) s.active = false;

        emit Withdrawn(id, available);
    }

    // -------- cancel --------

    function cancel(uint256 id) external {
        Stream storage s = streams[id];
        require(s.active, "inactive");
        require(msg.sender == s.sender, "not sender");

        (uint256 toRecipient, uint256 toSender) = streamBalance(id);
        s.active = false;

        if (toRecipient > 0) {
            s.withdrawn += toRecipient;
            (bool recipientOk, ) = payable(s.recipient).call{value: toRecipient}("");
            require(recipientOk, "recipient transfer failed");
        }
        if (toSender > 0) {
            (bool senderOk, ) = payable(s.sender).call{value: toSender}("");
            require(senderOk, "sender transfer failed");
        }

        emit Cancelled(id, toRecipient, toSender);
    }

    // -------- view helpers --------

    function getOutgoing(address sender) external view returns (uint256[] memory) {
        return outgoing[sender];
    }

    function getIncoming(address recipient) external view returns (uint256[] memory) {
        return incoming[recipient];
    }

    receive() external payable {}
}

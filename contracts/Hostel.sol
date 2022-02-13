pragma solidity ^0.8.11;

contract Hostel {
  struct Tenant {
    string first_name;
    string last_name;
    address addr;
  }

  struct Room {
    uint8 number;
    string name;
    uint rent;
    Tenant occupant;
    bool is_vacant;
  }

  struct OccupancyInfo {
    address tenant;
    uint lease_start;
    uint lease_end;
    uint contract_aggreement;
    Room room;
  }

  address landlord;
  Room[] rooms;
  uint public number_of_occupants = 0;
  uint public number_of_rooms = 0;
  // mapping(uint => Room) public Room_by_number;
  mapping(uint8 => OccupancyInfo) private occupancies;
  mapping(address => Tenant) private tenant;

  constructor () {
    for (uint8 i = 0; i < 10; i++) {
      _createRoom(i);
    }
  }

  modifier onlyLandlord () {
    require(msg.sender == landlord, "Only the landlord can access this method!");
    _;
  }

  modifier notLandlord {
    require(msg.sender != landlord, "Only tenants can access this method!");
    _;
  }

  modifier onlyWhileVacant (uint8 _room_id) {
    require(!rooms[_room_id].is_vacant, "This room is occupied!");
    _;
  }

  modifier enoughRent (uint8 _room_id) {
    require(msg.value >= rooms[_room_id].rent, "Not enough rent!");
    _;
  }

  modifier sameTenant (uint8 _room_id) {
    require(msg.sender == rooms[_room_id].occupant.addr, "Only the occupant is allowed in here!");
    _;
  }

  modifier leaseTimeUp (uint8 _room_id) {
    require(block.timestamp < occupancies[_room_id].lease_end, "Your lease time has expired!");
    _;
  }

  function _createRoom (uint8 _id) internal {
    rooms.push(Room(_id, "room", 2000, Tenant("", "", address(0x00)), true));
  }

  function setLandlord (address _landlord) public {
    //if (landlord) {
      landlord = _landlord;
    //}
  }

  function inspectRoom (uint8 _room_id) onlyWhileVacant(_room_id) public view returns (uint8, string memory, uint) {
    Room memory room = rooms[_room_id];
    return (room.number, room.name, room.rent);
  }
}

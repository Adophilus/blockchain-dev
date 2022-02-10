const Hostel = artifacts.require("Hostel");

contract("Hostel", (accounts) => {
  it("should inspect a room", () => Hostel.deployed()
      .then(instance => (instance.inspectRoom(0).call())
      .then(room => console.log(room))
  );
})

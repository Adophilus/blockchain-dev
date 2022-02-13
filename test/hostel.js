const Hostel = artifacts.require("Hostel");

contract("Hostel", (accounts) => {
  it("should run tests for Hostel contract", () => {
    Hostel.deployed().then((instance) => {
      it("should inspect a room", () => {
        const roomNumber = 0;
        instance
          .inspectRoom(roomNumber)
          .call()
          .then((room) => {
            console.log(room);
          });
      });
    });
  });
});

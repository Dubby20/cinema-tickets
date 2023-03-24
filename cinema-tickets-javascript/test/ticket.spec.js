import TicketService from "../src/pairtest/TicketService.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";

describe("TicketService", () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService(
      new TicketPaymentService(),
      new SeatReservationService()
    );
  });

  describe("purchaseTickets", () => {
    it("throws an error if no ticket requests are provided", () => {
      expect(() => ticketService.purchaseTickets(123)).toThrow(
        InvalidPurchaseException
      );
    });

    it("throws an error if the total number of tickets purchased is more than 20", () => {
      const purchaseRequests = [
        { type: "ADULT", noOfTickets: 10 },
        { type: "CHILD", noOfTickets: 10 },
        { type: "INFANT", noOfTickets: 1 },
      ];

      expect(() =>
        ticketService.purchaseTickets(123, ...purchaseRequests)
      ).toThrow(InvalidPurchaseException);
    });

    it("throws an error if no adult ticket is purchased", () => {
      const purchaseRequests = [{ type: "CHILD", noOfTickets: 2 }];

      expect(() =>
        ticketService.purchaseTickets(123, ...purchaseRequests)
      ).toThrow(InvalidPurchaseException);
    });

    it("throws an error if there is not at least one adult per infant", () => {
      const purchaseRequests = [
        { type: "ADULT", noOfTickets: 1 },
        { type: "INFANT", noOfTickets: 2 },
      ];

      expect(() =>
        ticketService.purchaseTickets(123, ...purchaseRequests)
      ).toThrow(InvalidPurchaseException);
    });

    it("calculates the correct total price for the purchase", () => {
      const purchaseRequests = [
        { type: "ADULT", noOfTickets: 2 },
        { type: "CHILD", noOfTickets: 1 },
      ];

      const makePaymentSpy = jest.spyOn(
        TicketPaymentService.prototype,
        "makePayment"
      );

      ticketService.purchaseTickets(123, ...purchaseRequests);
      expect(makePaymentSpy).toHaveBeenCalledWith(123, 50);
    });

    it("calculates the correct total number of seats", () => {
      const purchaseRequests = [
        { type: "ADULT", noOfTickets: 2 },
        { type: "CHILD", noOfTickets: 1 },
        { type: "INFANT", noOfTickets: 2 },
      ];

      const reserveSeatSpy = jest.spyOn(
        SeatReservationService.prototype,
        "reserveSeat"
      );

      ticketService.purchaseTickets(123, ...purchaseRequests);

      expect(reserveSeatSpy).toHaveBeenCalledWith(123, 3);
    });
  });
});

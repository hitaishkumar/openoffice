const RoomSummary = ({
  totalRooms,
  availableRooms,
  bookedRooms,
  maintenanceRooms,
}: {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  maintenanceRooms: number;
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between gap-4">
        <div className="">
          <div className="text-muted-foreground text-xs">Total Rooms</div>
          <div className="text-2xl font-bold py-1">{totalRooms}</div>
          <div className="border px-1 rounded-xl shadow-sm bg-blue-100/50 text-xs text-black-500/60">
            across all floors
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Available Now</div>
          <div className="text-2xl font-bold py-1">{availableRooms}</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-green-100/50 text-xs text-black-300/60">
            ready to book
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Booked Today</div>
          <div className="text-2xl font-bold py-1">{bookedRooms}</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-blue-100/50 text-xs text-black-300/60">
            occupied
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">In Maintenance</div>
          <div className="text-2xl font-bold py-1">{maintenanceRooms}</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-orange-100/50 text-xs text-black-300/60">
            unavailable
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSummary;

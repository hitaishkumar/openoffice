const UsageSummary = () => {
  return (
    <div className="w-full">
      UsageSummary
      <div className="flex justify-between">
        <div className="">
          <div className="text-muted-foreground text-xs">Total Items</div>
          <div className="text-2xl font-bold py-1">15</div>
          <div className="border px-1 rounded-xl shadow-sm bg-blue-100/50 text-xs text-black-500/60">
            6 categories
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Out of Stock</div>
          <div className="text-2xl font-bold py-1">1</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-red-100/50 text-xs text-black-300/60">
            needs immediate restock
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Low Stock</div>
          <div className="text-2xl font-bold py-1">7</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-amber-100/50 text-xs text-black-300/60">
            below reorder threshold
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Expiring Soon</div>
          <div className="text-2xl font-bold py-1">1</div>
          <div className=" border px-1 rounded-xl shadow-sm bg-amber-100/50 text-xs text-black-300/60">
            within 7 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageSummary;

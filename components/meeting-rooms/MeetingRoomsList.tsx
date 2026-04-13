"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomDetailsDialog } from "./RoomDetailsDialog";
import { Users, Zap } from "lucide-react";

export type MeetingRoom = {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  status: "available" | "booked" | "maintenance";
  facilities: string[];
  nextBooking: string | null;
  bookingTime: string;
};

export function MeetingRoomsList({ rooms }: { rooms: MeetingRoom[] }) {
  const getStatusStyle = (status: MeetingRoom["status"]) => {
    if (status === "available") return "bg-green-100 text-green-700";
    if (status === "booked") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  const getStatusLabel = (status: MeetingRoom["status"]) => {
    if (status === "available") return "Available";
    if (status === "booked") return "Booked";
    return "Maintenance";
  };

  const columns = useMemo<ColumnDef<MeetingRoom>[]>(
    () => [
      {
        header: "Room",
        accessorKey: "name",
        cell: ({ row }) => {
          const room = row.original;
          return (
            <div className="space-y-1">
              <div className="font-medium text-sm">{room.name}</div>
              <div className="text-xs text-muted-foreground">{room.id}</div>
            </div>
          );
        },
      },
      {
        header: "Floor",
        accessorKey: "floor",
      },
      {
        header: "Capacity",
        accessorKey: "capacity",
        cell: ({ getValue }) => {
          const capacity = getValue<number>();
          return (
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              {capacity} people
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue<MeetingRoom["status"]>();
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(
                status,
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          );
        },
      },
      {
        header: "Facilities",
        accessorKey: "facilities",
        cell: ({ row }) => {
          const facilities = row.original.facilities;
          return (
            <div className="flex gap-1 flex-wrap">
              {facilities.slice(0, 2).map((facility) => (
                <Badge key={facility} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
              {facilities.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{facilities.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        header: "Current Booking",
        cell: ({ row }) => {
          const room = row.original;
          if (room.status === "available") {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <div className="space-y-1">
              <div className="text-xs font-medium">{room.nextBooking}</div>
              <div className="text-xs text-muted-foreground">{room.bookingTime}</div>
            </div>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const room = row.original;

          return (
            <div className="flex gap-2">
              {room.status === "available" ? (
                <>
                  <Button size="sm" variant="default">
                    Book
                  </Button>
                  <RoomDetailsDialog room={room} />
                </>
              ) : room.status === "booked" ? (
                <>
                  <Button size="sm" variant="outline">
                    View Booking
                  </Button>
                  <RoomDetailsDialog room={room} />
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" disabled>
                    Edit
                  </Button>
                  <RoomDetailsDialog room={room} />
                </>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-xs font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No meeting rooms found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

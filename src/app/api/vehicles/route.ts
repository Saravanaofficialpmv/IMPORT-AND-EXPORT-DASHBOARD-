import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
    try {
        const vehicles = mockDb.getVehicles();
        const trips = mockDb.getTrips();
        
        // Map snake_case to camelCase for the frontend
        const mappedVehicles = vehicles.map((v: any) => ({
            id: v.id,
            vehicleNumber: v.vehicle_number,
            driverName: v.driver_name,
            driverPhone: v.driver_phone,
            permitId: v.permit_id,
            status: v.status,
            createdAt: v.created_at,
            _count: {
                trips: trips.filter((t: any) => t.vehicle_id === v.id).length
            }
        }));

        return NextResponse.json(mappedVehicles);
    } catch (error) {
        console.error("Vehicles GET error:", error);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const vehicle = mockDb.createVehicle({
            vehicle_number: body.vehicleNumber,
            driver_name: body.driverName,
            driver_phone: body.driverPhone,
            permit_id: body.permitId,
            status: body.status || "ACTIVE",
            manager_id: body.managerId,
        });

        const mappedVehicle = {
            id: vehicle.id,
            vehicleNumber: vehicle.vehicle_number,
            driverName: vehicle.driver_name,
            driverPhone: vehicle.driver_phone,
            permitId: vehicle.permit_id,
            status: vehicle.status,
            createdAt: vehicle.created_at,
        };

        return NextResponse.json(mappedVehicle, { status: 201 });
    } catch (error) {
        console.error("Vehicles POST error:", error);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}

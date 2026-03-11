import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.vehicleLocation.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@gps.com', password: hashedPassword, role: 'ADMIN', phone: '+91 9876543210' } });
    const manager = await prisma.user.create({ data: { name: 'Rajesh Kumar', email: 'manager@gps.com', password: hashedPassword, role: 'MANAGER', phone: '+91 9876543211' } });
    const driver1 = await prisma.user.create({ data: { name: 'Suresh Patel', email: 'driver1@gps.com', password: hashedPassword, role: 'DRIVER', phone: '+91 9876543212' } });
    const driver2 = await prisma.user.create({ data: { name: 'Amit Singh', email: 'driver2@gps.com', password: hashedPassword, role: 'DRIVER', phone: '+91 9876543213' } });
    const driver3 = await prisma.user.create({ data: { name: 'Vikram Sharma', email: 'driver3@gps.com', password: hashedPassword, role: 'DRIVER', phone: '+91 9876543214' } });

    const v1 = await prisma.vehicle.create({ data: { vehicleNumber: 'TN-01-AB-1234', driverName: 'Suresh Patel', driverPhone: '+91 9876543212', permitId: 'PRM-2026-001', status: 'IN_TRANSIT', managerId: manager.id } });
    const v2 = await prisma.vehicle.create({ data: { vehicleNumber: 'TN-02-CD-5678', driverName: 'Amit Singh', driverPhone: '+91 9876543213', permitId: 'PRM-2026-002', status: 'ACTIVE', managerId: manager.id } });
    const v3 = await prisma.vehicle.create({ data: { vehicleNumber: 'KA-03-EF-9012', driverName: 'Vikram Sharma', driverPhone: '+91 9876543214', permitId: 'PRM-2026-003', status: 'IN_TRANSIT', managerId: manager.id } });
    const v4 = await prisma.vehicle.create({ data: { vehicleNumber: 'MH-04-GH-3456', driverName: 'Rahul Verma', driverPhone: '+91 9876543215', permitId: 'PRM-2026-004', status: 'ACTIVE', managerId: manager.id } });
    const v5 = await prisma.vehicle.create({ data: { vehicleNumber: 'DL-05-IJ-7890', driverName: 'Deepak Joshi', driverPhone: '+91 9876543216', permitId: 'PRM-2026-005', status: 'INACTIVE', managerId: manager.id } });

    const now = new Date();
    const t1 = await prisma.trip.create({ data: { origin: 'Chennai Port', destination: 'Bangalore Warehouse', originLat: 13.0827, originLng: 80.2707, destLat: 12.9716, destLng: 77.5946, cargo: 'Electronic Components - 500 units', permitId: 'PRM-2026-001', allowedTrips: 3, status: 'ACTIVE', startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), vehicleId: v1.id, driverId: driver1.id, managerId: manager.id, routeTaken: JSON.stringify([{ lat: 13.0827, lng: 80.2707 }, { lat: 12.92, lng: 79.85 }, { lat: 12.85, lng: 79.20 }]) } });
    const t2 = await prisma.trip.create({ data: { origin: 'Mumbai Port', destination: 'Pune Distribution Center', originLat: 18.922, originLng: 72.8347, destLat: 18.5204, destLng: 73.8567, cargo: 'Automobile Parts - 200 crates', permitId: 'PRM-2026-002', allowedTrips: 5, status: 'COMPLETED', startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), endTime: new Date(now.getTime() - 20 * 60 * 60 * 1000), vehicleId: v2.id, driverId: driver2.id, managerId: manager.id } });
    const t3 = await prisma.trip.create({ data: { origin: 'Cochin Port', destination: 'Coimbatore Depot', originLat: 9.9312, originLng: 76.2673, destLat: 11.0168, destLng: 76.9558, cargo: 'Spices - 1000 kg', permitId: 'PRM-2026-003', allowedTrips: 2, status: 'ACTIVE', startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), vehicleId: v3.id, driverId: driver3.id, managerId: manager.id, routeTaken: JSON.stringify([{ lat: 9.9312, lng: 76.2673 }, { lat: 10.36, lng: 76.55 }]) } });
    await prisma.trip.create({ data: { origin: 'Vizag Port', destination: 'Hyderabad Warehouse', originLat: 17.6868, originLng: 83.2185, destLat: 17.385, destLng: 78.4867, cargo: 'Steel Materials - 50 tons', permitId: 'PRM-2026-004', allowedTrips: 4, status: 'PENDING', vehicleId: v4.id, driverId: driver2.id, managerId: manager.id } });
    await prisma.trip.create({ data: { origin: 'Chennai Port', destination: 'Madurai Depot', originLat: 13.0827, originLng: 80.2707, destLat: 9.9252, destLng: 78.1198, cargo: 'Textile Goods - 300 bales', permitId: 'PRM-2026-001', allowedTrips: 3, status: 'COMPLETED', startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000), endTime: new Date(now.getTime() - 40 * 60 * 60 * 1000), vehicleId: v1.id, driverId: driver1.id, managerId: manager.id } });
    await prisma.trip.create({ data: { origin: 'Kolkata Port', destination: 'Patna Warehouse', originLat: 22.5726, originLng: 88.3639, destLat: 25.6093, destLng: 85.1376, cargo: 'Machinery Parts - 100 units', permitId: 'PRM-2026-005', allowedTrips: 2, status: 'FLAGGED', startTime: new Date(now.getTime() - 72 * 60 * 60 * 1000), endTime: new Date(now.getTime() - 62 * 60 * 60 * 1000), vehicleId: v5.id, driverId: driver3.id, managerId: manager.id } });

    await prisma.alert.createMany({
        data: [
            { type: 'PERMIT_MISUSE', message: 'Vehicle TN-01-AB-1234 has used permit PRM-2026-001 for 3 trips. Maximum allowed: 3.', severity: 'CRITICAL', tripId: t1.id, vehicleId: v1.id },
            { type: 'DEVIATION', message: 'Vehicle KA-03-EF-9012 deviated from designated route near Palakkad.', severity: 'WARNING', tripId: t3.id, vehicleId: v3.id },
            { type: 'UNAUTHORIZED', message: 'Unauthorized trip detected for vehicle DL-05-IJ-7890. Permit expired.', severity: 'CRITICAL', vehicleId: v5.id },
            { type: 'TRIP_LIMIT', message: 'Vehicle TN-02-CD-5678 approaching trip limit for permit PRM-2026-002.', severity: 'INFO', tripId: t2.id, vehicleId: v2.id, resolved: true },
            { type: 'DEVIATION', message: 'Vehicle TN-01-AB-1234 detected at unauthorized checkpoint.', severity: 'WARNING', tripId: t1.id, vehicleId: v1.id },
        ]
    });

    await prisma.vehicleLocation.createMany({
        data: [
            { vehicleId: v1.id, lat: 12.85, lng: 79.20, speed: 65, heading: 240, timestamp: new Date(now.getTime() - 10 * 60 * 1000) },
            { vehicleId: v1.id, lat: 12.82, lng: 79.10, speed: 70, heading: 235, timestamp: new Date(now.getTime() - 5 * 60 * 1000) },
            { vehicleId: v1.id, lat: 12.78, lng: 78.95, speed: 60, heading: 230, timestamp: now },
            { vehicleId: v3.id, lat: 10.36, lng: 76.55, speed: 55, heading: 45, timestamp: new Date(now.getTime() - 10 * 60 * 1000) },
            { vehicleId: v3.id, lat: 10.42, lng: 76.62, speed: 58, heading: 50, timestamp: new Date(now.getTime() - 5 * 60 * 1000) },
            { vehicleId: v3.id, lat: 10.50, lng: 76.70, speed: 62, heading: 48, timestamp: now },
        ]
    });

    console.log('✅ Database seeded successfully!');
    console.log('  Admin:   admin@gps.com / password123');
    console.log('  Manager: manager@gps.com / password123');
    console.log('  Driver:  driver1@gps.com / password123');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

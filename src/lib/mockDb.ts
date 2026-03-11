import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data.json');

// Initialize with some data if it doesn't exist or is empty
const defaultData = {
    vehicles: [
        { id: "1", vehicle_number: "TN-01-AB-1234", driver_name: "John Doe", driver_phone: "9876543210", permit_id: "PER-001", status: "ACTIVE", created_at: new Date().toISOString() },
        { id: "2", vehicle_number: "KA-05-CD-5678", driver_name: "Jane Smith", driver_phone: "9876543211", permit_id: "PER-002", status: "IN_TRANSIT", created_at: new Date().toISOString() },
        { id: "3", vehicle_number: "MH-12-EF-9012", driver_name: "Alex Johnson", driver_phone: "9876543212", permit_id: "PER-003", status: "INACTIVE", created_at: new Date().toISOString() },
    ],
    trips: [
        { id: "1", vehicle_id: "2", origin: "Chennai Port", destination: "Bangalore Hub", status: "ACTIVE", start_time: new Date().toISOString(), created_at: new Date().toISOString() },
    ],
    alerts: [
        { id: "1", type: "ROUTE_DEVIATION", message: "Vehicle KA-05-CD-5678 deviated from assigned route.", severity: "WARNING", resolved: false, vehicle_id: "2", created_at: new Date().toISOString() },
        { id: "2", type: "SPEEDING", message: "Vehicle TN-01-AB-1234 exceeded limit by 15mph.", severity: "INFO", resolved: false, vehicle_id: "1", created_at: new Date().toISOString() },
    ],
    locations: [
        { vehicle_id: "1", lat: 13.0827, lng: 80.2707, speed: 45, timestamp: new Date().toISOString() },
        { vehicle_id: "2", lat: 12.9716, lng: 77.5946, speed: 60, timestamp: new Date().toISOString() },
        { vehicle_id: "3", lat: 19.0760, lng: 72.8777, speed: 0, timestamp: new Date().toISOString() },
    ]
};

function readDb() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.vehicles || parsed.vehicles.length === 0) {
            fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        return parsed;
    } catch (e) {
        return defaultData;
    }
}

function writeDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const mockDb = {
    getDb: readDb,
    saveDb: writeDb,
    
    // Vehicles
    getVehicles: () => {
        const db = readDb();
        return db.vehicles.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    createVehicle: (data: any) => {
        const db = readDb();
        const v = { ...data, id: uuidv4(), created_at: new Date().toISOString() };
        db.vehicles.push(v);
        writeDb(db);
        return v;
    },
    updateVehicle: (id: string, data: any) => {
        const db = readDb();
        const idx = db.vehicles.findIndex((v: any) => v.id === id);
        if (idx >= 0) {
            db.vehicles[idx] = { ...db.vehicles[idx], ...data };
            writeDb(db);
            return db.vehicles[idx];
        }
        return null;
    },
    deleteVehicle: (id: string) => {
        const db = readDb();
        db.vehicles = db.vehicles.filter((v: any) => v.id !== id);
        writeDb(db);
        return true;
    },

    // Trips
    getTrips: () => {
        const db = readDb();
        return db.trips.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    createTrip: (data: any) => {
        const db = readDb();
        const t = { ...data, id: uuidv4(), created_at: new Date().toISOString() };
        db.trips.push(t);
        writeDb(db);
        return t;
    },
    updateTrip: (id: string, data: any) => {
        const db = readDb();
        const idx = db.trips.findIndex((t: any) => t.id === id);
        if (idx >= 0) {
            db.trips[idx] = { ...db.trips[idx], ...data };
            writeDb(db);
            return db.trips[idx];
        }
        return null;
    },

    // Alerts
    getAlerts: () => {
        const db = readDb();
        return db.alerts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    updateAlert: (id: string, data: any) => {
        const db = readDb();
        const idx = db.alerts.findIndex((a: any) => a.id === id);
        if (idx >= 0) {
            db.alerts[idx] = { ...db.alerts[idx], ...data };
            writeDb(db);
            return db.alerts[idx];
        }
        return null;
    },
    
    // Locations
    getLocations: () => {
        const db = readDb();
        return db.locations;
    }
};

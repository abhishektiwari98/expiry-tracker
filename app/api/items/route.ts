import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Item from "../../models/Item";

//GET
export async function GET() {
    await connectDB();
    const items = await Item.find({});
    return NextResponse.json(items);
}

//POST
export async function POST(req: Request) {
    await connectDB();
    const { name, expiryDate, barcode, icon } = await req.json();

    if (!name || !expiryDate || !icon) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await Item.create({ name, expiryDate, barcode, icon });
    return NextResponse.json(newItem, { status: 201 });
}

//DELETE
export async function DELETE(req: Request) {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await Item.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: "Items deleted successfully" });
}

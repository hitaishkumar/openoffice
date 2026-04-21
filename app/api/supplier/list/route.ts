import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

export type Supplier = {
  supplier_id: string;

  // Basic Info
  supplier_name: string;
  display_name: string | null;
  supplier_code: string | null;

  // Contact Info
  contact_person_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_alternate_phone: string | null;

  // Address
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;

  // Business
  gst_number: string | null;
  pan_number: string | null;
  business_type: string | null;
  registration_number: string | null;

  // Operational
  is_active: boolean;
  is_preferred: boolean;
  lead_time_days: number | null;

  // Notes / Tags
  supplier_notes: string | null;
  tags: string[] | null;

  // Payments
  bank_name: string | null;
  account_number: string | null;
  ifsc: string | null;
  upi_id: string | null;

  // Audit
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
};

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        supplier_id,
        supplier_name,
        display_name,
        supplier_code,

        contact_person_name,
        contact_email,
        contact_phone,
        contact_alternate_phone,

        address_line1,
        address_line2,
        city,
        state,
        country,
        postal_code,

        gst_number,
        pan_number,
        business_type,
        registration_number,

        is_active,
        is_preferred,
        lead_time_days,

        supplier_notes,
        tags,

        bank_name,
        account_number,
        ifsc,
        upi_id,

        created_at,
        created_by,
        updated_at,
        updated_by

      FROM suppliers
      ORDER BY created_at DESC
    `);

    const data: Supplier[] = result.rows;

    return NextResponse.json<ApiResponse<Supplier[]>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET SUPPLIERS ERROR:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch suppliers",
        data: null,
      },
      { status: 500 },
    );
  }
}

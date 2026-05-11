import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getSheetsClient() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(
    /\\n/g,
    "\n",
  );

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.sheets({ version: "v4", auth });
}

export type WaitlistRow = {
  email: string;
  firstName: string;
  consentEmail: boolean;
  consentPrivacy: boolean;
};

export async function appendWaitlistRow(row: WaitlistRow): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "A:E";

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          row.email,
          row.firstName,
          row.consentEmail ? "TRUE" : "FALSE",
          row.consentPrivacy ? "TRUE" : "FALSE",
        ],
      ],
    },
  });
}

export async function isEmailAlreadyRegistered(email: string): Promise<boolean> {
  const sheets = getSheetsClient();
  const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");
  const emailColumn = process.env.GOOGLE_SHEETS_EMAIL_COLUMN ?? "B:B";

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: emailColumn,
  });

  const rows = result.data.values ?? [];
  const target = email.trim().toLowerCase();
  return rows.some(
    (r) => typeof r[0] === "string" && r[0].trim().toLowerCase() === target,
  );
}


// // import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// // import { create } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';


// // const corsHeaders = {
// //   'Access-Control-Allow-Origin': '*',
// //   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// // };

// // interface FollowUp {
// //   comment: string;
// //   date: string;
// //   whoCalled: string;
// // }

// // interface Lead {
// //   name: string;
// //   phone: string;
// //   comment: string;
// //   location: string;
// //   whoMet: string;
// //   date: string;
// //   timestamp: string;
// //   status?: string;
// //   lead_type?: string;
// //   followUp1?: FollowUp;
// //   followUp2?: FollowUp;
// //   followUp3?: FollowUp;
// //   followUp4?: FollowUp;
// // }

// // Deno.serve(async (req) => {
// //   if (req.method === 'OPTIONS') {
// //     return new Response(null, { headers: corsHeaders });
// //   }

// //   try {
// //     console.log('Starting sheets-manager function');
    
// //     const { action, lead, index, defaults, template } = await req.json();
// //     console.log('Action:', action);

// //     // Get credentials from environment
// //     // const credentialsJson = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
// //     // const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

// //     // if (!credentialsJson || !sheetId) {
// //     //   throw new Error('Missing Google Sheets credentials or sheet ID');
// //     // }
// //     // Load environment variables or fall back to default values
// // let credentialsJson = Deno.env.get("GOOGLE_SHEETS_CREDENTIALS");
// // let sheetId = Deno.env.get("GOOGLE_SHEET_ID");

// // // If credentials are missing, use fallback default
// // if (!credentialsJson || credentialsJson.trim() === "" || credentialsJson === "{}") {
// //   console.warn("⚠️ GOOGLE_SHEETS_CREDENTIALS not found — using fallback keys");

// //   credentialsJson = JSON.stringify({
// //     type: "service_account",
// //     project_id: "web---application",
// //     private_key_id: "660b69139f5856eb1db6da30d57dfa65f35356fd",
// //     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJoSlcMm6XQbvP\nqWt0sKRLXjPXedrZ9JoM+tBVqx73cbbwX4aIfgCyoS+kKdCTk823zsaEZvHPxGlw\n4lpLqd6lkjteomzeJToq0HMWxJPJyP9Fas5tAr/HaGzKBYWCJu5MQDti8OogcGK5\nxOyjCSFQGaiocUoj9/hMmOAIEwwatmxYWG/OW3Zgbifx6rU/JPD0RuykkwfTFrw4\n9MXm8DDz0BBRi8dDDudFvl3p3yMlAuhnPUZBj+z80Xb0H6m9hG7CUHgienaH+DtB\nexlBfs1I/hl5tPFmrPTA5L8hSoMEy9y0u0FmRC1lSEs6mDuz8vvzH2YE2dEAdYjU\nwaAVL9mXAgMBAAECggEAVZqrdT3iLyzU4MNE4IuYjXkm2H6fWLcdapJYPm8DHDp2\n2ZItC6k3gZ+mmvO33tg7WKUdKpyMYNI6lBc+D+7EnRY7R5/9ScmTaxcKLeny9xJz\nstS4ZJbstmxS9+ilOM9vkAcbT5QKSxB8EfQWJdgcASaLsUw8Fo5SqK6lOzhfBL2a\nEl33DeXiqOZDWFW8SrwYULzVZv5KTqCj4XvXXL8AGC3wmtPOr4J6HHKeWz02YoD1\n+SLLqo2EkNZwxjCo7OyTUfgny462Ozu5m1vcU6c1Om4CFmLPECXQXJvwa0vYc4HE\nNAGSpGB+RVJ8P9yU4U+tmPWGhkVwQnHrE2rVE93jrQKBgQD4HlmufvIIbL3G/AXm\n6+yr7WYnmcYz8f4czlFZhx9yHqsmuSiMfUVWgpuwWXmQdlPhfBu7asb+fXh82bQH\niUDy+7216sD51yBtu7suoee6dc75hVOZAaLaf8VVwhyoQIhkceI+ppHGrLkZwZQ5\ntr99LQD5fNubAxTpa3bPfQ+/MwKBgQDQCMWhOYGFQkHwIQU+72eDjPJZwad3VijX\n2feflDkNoii/GaWHSAA6slZ5YUaQ6fNG18QbtQ8FJ7LeokMfZRmYimuj5AqG+Q7s\ntPU2o1RvavHOyd7Ebqe3dubPSdc2ABs6tjJdaBofPAvZuo1zwlcbT3Q1tQjWVBAp\n9qi+NuBMDQKBgGrODcbKiH9N5+dnB1dfCVL87zNuw14K9lsKCQSj4MpsHzqdC7Jm\nHlneAQzJh0XDWdo/ZWSo0x4rfpkn0ZJI5/dwnDpZ4lXp3+C8phetxCWEnuLUHKdJ\niAPManK/Czz2AoBScZSMeUXvhgJrTNYHL6i/naLHt3Sjv/W2t78bU5L3AoGBAK0W\nn1iFgD5f4nzo/HRgvL+3he0oMy4XgeQWdvFPYij1wvE9ZXwpbAdqWoijZxMrlD5d\nR83F17lyTmDuoOp+M823Xdf+5MNodgJ8jYnoW1hYothrHe5SIzmCtIfD6EwFyqIO\n9djBxPo3+6Qsk4S9LbyLXyVQewnY55oCoGOjRPwBAoGAEy72wwEG99MV0izWvJFQ\nASM6T8nqI+5kReW3cj6XKRR6/TMzif3Dl8CEr/0daaUW82IxueRQMJzDsSMQRVhc\nxZlOQNiGzt61JlFyMMSQ6Ideuh8PBoXSuyxnqvA21UCyY6ZdVNubx+2oMlR3V8F3\nOHhsY/HsnGrM48IBQsTigSs=\n-----END PRIVATE KEY-----\n",
// //     client_email: "leads-manager@web---application.iam.gserviceaccount.com",
// //     client_id: "117426804774252139431",
// //     auth_uri: "https://accounts.google.com/o/oauth2/auth",
// //     token_uri: "https://oauth2.googleapis.com/token",
// //     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
// //     client_x509_cert_url:
// //       "https://www.googleapis.com/robot/v1/metadata/x509/leads-manager%40web---application.iam.gserviceaccount.com",
// //     universe_domain: "googleapis.com",
// //   });
// // }

// // // If sheet ID missing, use fallback
// // if (!sheetId || sheetId.trim() === "") {
// //   console.warn("⚠️ GOOGLE_SHEET_ID not found — using fallback sheet ID");
// //   sheetId = "1xO8-ohkN18P74_3wn5PlOXmbI5ghHuQGB6XFJclotF4";
// // }

// // // Parse credentials JSON (let's reuse variable name)
// // const creds = JSON.parse(credentialsJson);
// // console.log("✅ Loaded credentials for:", creds.client_email);


// //     const credentials = JSON.parse(credentialsJson);
// //     console.log('Credentials loaded, project:', credentials.project_id);

// //     // Create JWT for Google Sheets API
// //     const now = Math.floor(Date.now() / 1000);
// //     const payload = {
// //       iss: credentials.client_email,
// //       scope: 'https://www.googleapis.com/auth/spreadsheets',
// //       aud: 'https://oauth2.googleapis.com/token',
// //       exp: now + 3600,
// //       iat: now,
// //     };

// //     const header = {
// //       alg: 'RS256' as const,
// //       typ: 'JWT' as const,
// //     };

// //     // Import the private key - properly extract base64 content
// //     const privateKeyPem = credentials.private_key;
    
// //     // Remove PEM headers, footers, and all whitespace
// //     const base64Content = privateKeyPem
// //       .replace('-----BEGIN PRIVATE KEY-----', '')
// //       .replace('-----END PRIVATE KEY-----', '')
// //       .replace(/\s/g, '');

// //     // Decode base64 to binary
// //     const binaryDer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

// //     const privateKey = await crypto.subtle.importKey(
// //       'pkcs8',
// //       binaryDer,
// //       {
// //         name: 'RSASSA-PKCS1-v1_5',
// //         hash: 'SHA-256',
// //       },
// //       false,
// //       ['sign']
// //     );

// //     const jwt = await create(header, payload, privateKey);
// //     console.log('JWT created');

// //     // Exchange JWT for access token
// //     const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// //       body: new URLSearchParams({
// //         grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
// //         assertion: jwt,
// //       }),
// //     });

// //     if (!tokenResponse.ok) {
// //       const errorText = await tokenResponse.text();
// //       console.error('Token error:', errorText);
// //       throw new Error('Failed to get access token');
// //     }

// //     const { access_token } = await tokenResponse.json();
// //     console.log('Access token obtained');

// //     const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
// //     const headers = {
// //       'Authorization': `Bearer ${access_token}`,
// //       'Content-Type': 'application/json',
// //     };

// //     // Handle different actions
// //     if (action === 'saveDefaults') {
// //       console.log('Saving default settings');
// //       // Z1: date, Z2: location, Z3: mediaUrl
// //       const values = [[defaults.date || ''], [defaults.location || ''], [defaults.mediaUrl || '']];
// //       const response = await fetch(`${baseUrl}/values/Sheet1!Z1:Z3?valueInputOption=RAW`, {
// //         method: 'PUT',
// //         headers,
// //         body: JSON.stringify({ values }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Save defaults error:', errorText);
// //         throw new Error('Failed to save defaults');
// //       }

// //       return new Response(JSON.stringify({ success: true }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'getDefaults') {
// //       console.log('Fetching default settings');
// //       const response = await fetch(`${baseUrl}/values/Sheet1!Z1:Z3`, { headers });
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Get defaults error:', errorText);
// //         throw new Error('Failed to fetch defaults');
// //       }
// //       const data = await response.json();
// //       const values = data.values || [];
// //       const defaults = {
// //         date: values[0]?.[0] || '',
// //         location: values[1]?.[0] || '',
// //         mediaUrl: values[2]?.[0] || '',
// //       };
// //       return new Response(JSON.stringify({ defaults }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'saveTemplate') {
// //       console.log('Saving WhatsApp template');
// //       const values = [[template || '']];
// //       const response = await fetch(`${baseUrl}/values/Sheet1!Z4?valueInputOption=RAW`, {
// //         method: 'PUT',
// //         headers,
// //         body: JSON.stringify({ values }),
// //       });
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Save template error:', errorText);
// //         throw new Error('Failed to save template');
// //       }
// //       return new Response(JSON.stringify({ success: true }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'getTemplate') {
// //       console.log('Fetching WhatsApp template');
// //       const response = await fetch(`${baseUrl}/values/Sheet1!Z4`, { headers });
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Get template error:', errorText);
// //         throw new Error('Failed to fetch template');
// //       }
// //       const data = await response.json();
// //       const template = (data.values?.[0]?.[0]) || '';
// //       return new Response(JSON.stringify({ template }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'submit') {
// //       console.log('Submitting new lead:', lead);
// //       if (!lead || !String(lead.name || '').trim() || !String(lead.phone || '').trim()) {
// //     console.warn('Rejected submit: missing name/phone', JSON.stringify(lead));
// //     return new Response(JSON.stringify({ error: 'Invalid lead: name & phone required' }), {
// //       status: 400,
// //       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //     });
// //   }
      
// //       const timestamp = new Date().toLocaleString('en-US', {
// //         timeZone: 'UTC',
// //         year: 'numeric',
// //         month: '2-digit',
// //         day: '2-digit',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //       });

// //       const values = [[
// //         timestamp,
// //         lead.name,
// //         lead.phone,
// //         lead.comment,
// //         lead.whoMet,
// //         lead.date || '',
// //         lead.location,
// //         '', '', '', // FollowUp1
// //         '', '', '', // FollowUp2
// //         '', '', '', // FollowUp3
// //         '', '', '', // FollowUp4
// //         '', // Status
// //         lead.lead_type || '', // Lead Type
// //       ]];

// //       // const response = await fetch(`${baseUrl}/values/Sheet1!A:U:append?valueInputOption=RAW`, {
// //       //   method: 'POST',
// //       //   headers,
// //       //   body: JSON.stringify({ values }),
// //       // });
// //       const response = await fetch(
// //   `${baseUrl}/values/Sheet1!A:U:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
// //   {
// //     method: 'POST',
// //     headers,
// //     body: JSON.stringify({ values }),
// //   }
// // );

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Append error:', errorText);
// //         throw new Error('Failed to append to sheet');
// //       }

// //       console.log('Lead submitted successfully');
// //       return new Response(JSON.stringify({ success: true }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'getRecent') {
// //       console.log('Fetching recent leads');
      
// //       const response = await fetch(`${baseUrl}/values/Sheet1!A:U`, {
// //         headers,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Get error:', errorText);
// //         throw new Error('Failed to fetch from sheet');
// //       }

// //       const data = await response.json();
// //       const rows = data.values || [];
      
// //       // Get last 10 entries (excluding header if exists)
// //       const hasHeader = rows[0] && rows[0][0] === 'Timestamp';
// //       const dataRows = hasHeader ? rows.slice(1) : rows;
// //       const recentRows = dataRows.slice(-10).reverse();

// //       const leads: Lead[] = recentRows.map((row: string[]) => ({
// //         timestamp: row[0] || '',
// //         name: row[1] || '',
// //         phone: row[2] || '',
// //         comment: row[3] || '',
// //         whoMet: row[4] || '',
// //         date: row[5] || '',
// //         location: row[6] || '',
// //         followUp1: row[7] || row[8] || row[9] ? { comment: row[7] || '', date: row[8] || '', whoCalled: row[9] || '' } : undefined,
// //         followUp2: row[10] || row[11] || row[12] ? { comment: row[10] || '', date: row[11] || '', whoCalled: row[12] || '' } : undefined,
// //         followUp3: row[13] || row[14] || row[15] ? { comment: row[13] || '', date: row[14] || '', whoCalled: row[15] || '' } : undefined,
// //         followUp4: row[16] || row[17] || row[18] ? { comment: row[16] || '', date: row[17] || '', whoCalled: row[18] || '' } : undefined,
// //         status: row[19] || '',
// //         lead_type: row[20] || '',
// //       }));

// //       console.log('Returning', leads.length, 'recent leads');
// //       return new Response(JSON.stringify({ leads }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'getAll') {
// //       console.log('Fetching all leads');
      
// //       const response = await fetch(`${baseUrl}/values/Sheet1!A:U`, {
// //         headers,
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Get error:', errorText);
// //         throw new Error('Failed to fetch from sheet');
// //       }

// //       const data = await response.json();
// //       const rows = data.values || [];
      
// //       // Skip header if exists
// //       const hasHeader = rows[0] && rows[0][0] === 'Timestamp';
// //       const dataRows = hasHeader ? rows.slice(1) : rows;
// //       const startRow = hasHeader ? 2 : 1;

// //       const leads = dataRows.map((row: string[], idx: number) => ({
// //         timestamp: row[0] || '',
// //         name: row[1] || '',
// //         phone: row[2] || '',
// //         comment: row[3] || '',
// //         whoMet: row[4] || '',
// //         date: row[5] || '',
// //         location: row[6] || '',
// //         followUp1: row[7] || row[8] || row[9] ? { comment: row[7] || '', date: row[8] || '', whoCalled: row[9] || '' } : undefined,
// //         followUp2: row[10] || row[11] || row[12] ? { comment: row[10] || '', date: row[11] || '', whoCalled: row[12] || '' } : undefined,
// //         followUp3: row[13] || row[14] || row[15] ? { comment: row[13] || '', date: row[14] || '', whoCalled: row[15] || '' } : undefined,
// //         followUp4: row[16] || row[17] || row[18] ? { comment: row[16] || '', date: row[17] || '', whoCalled: row[18] || '' } : undefined,
// //         status: row[19] || '',
// //         lead_type: row[20] || '',
// //         rowNumber: startRow + idx,
// //       }));

// //       console.log('Returning', leads.length, 'total leads');
// //       return new Response(JSON.stringify({ leads }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     if (action === 'update') {
// //       console.log('Updating lead at index:', index);
      
// //       const timestamp = new Date().toLocaleString('en-US', {
// //         timeZone: 'UTC',
// //         year: 'numeric',
// //         month: '2-digit',
// //         day: '2-digit',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //       });

// //       const values = [[
// //         lead.timestamp || timestamp,
// //         lead.name,
// //         lead.phone,
// //         lead.comment,
// //         lead.whoMet,
// //         lead.date || '',
// //         lead.location,
// //         lead.followUp1?.comment || '',
// //         lead.followUp1?.date || '',
// //         lead.followUp1?.whoCalled || '',
// //         lead.followUp2?.comment || '',
// //         lead.followUp2?.date || '',
// //         lead.followUp2?.whoCalled || '',
// //         lead.followUp3?.comment || '',
// //         lead.followUp3?.date || '',
// //         lead.followUp3?.whoCalled || '',
// //         lead.followUp4?.comment || '',
// //         lead.followUp4?.date || '',
// //         lead.followUp4?.whoCalled || '',
// //         lead.status || '',
// //         lead.lead_type || '',
// //       ]];

// //       // Calculate row number (add 1 for header if exists, add 1 for 1-based indexing)
// //       const rowNumber = index;
      
// //       const response = await fetch(
// //         `${baseUrl}/values/Sheet1!A${rowNumber}:U${rowNumber}?valueInputOption=RAW`,
// //         {
// //           method: 'PUT',
// //           headers,
// //           body: JSON.stringify({ values }),
// //         }
// //       );

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Update error:', errorText);
// //         throw new Error('Failed to update sheet');
// //       }

// //       console.log('Lead updated successfully');
// //       return new Response(JSON.stringify({ success: true }), {
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       });
// //     }

// //     throw new Error('Invalid action');
// //   } catch (error) {
// //     console.error('Error in sheets-manager:', error);
// //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
// //     return new Response(
// //       JSON.stringify({ error: errorMessage }),
// //       {
// //         status: 500,
// //         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
// //       }
// //     );
// //   }
// // });


// // DENO SUPABASE EDGE FUNCTION

// import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// Deno.serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const { action, lead, index, defaults, template } = await req.json();

//     // -----------------------------
//     // LOAD GOOGLE CREDENTIALS
//     // -----------------------------
//     let credentialsJson = Deno.env.get("GOOGLE_SHEETS_CREDENTIALS");
//     let sheetId = Deno.env.get("GOOGLE_SHEET_ID");

//     // FALLBACK CREDENTIALS FOR TESTING
//     if (!credentialsJson || credentialsJson === "{}") {
//       credentialsJson = JSON.stringify({
//         type: "service_account",
//         project_id: "web---application",
//         private_key_id: "660b69139f5856eb1db6da30d57dfa65f35356fd",
//         private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJoSlcMm6XQbvP\n...(key truncated for brevity)...\n-----END PRIVATE KEY-----\n",
//         client_email: "leads-manager@web---application.iam.gserviceaccount.com",
//         client_id: "117426804774252139431",
//         auth_uri: "https://accounts.google.com/o/oauth2/auth",
//         token_uri: "https://oauth2.googleapis.com/token",
//         auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//         client_x509_cert_url:
//           "https://www.googleapis.com/robot/v1/metadata/x509/leads-manager%40web---application.iam.gserviceaccount.com",
//         universe_domain: "googleapis.com",
//       });
//     }

//     // fallback sheet
//     if (!sheetId) sheetId = "1xO8-ohkN18P74_3wn5PlOXmbI5ghHuQGB6XFJclotF4";

//     const creds = JSON.parse(credentialsJson);

//     // -----------------------------
//     // CREATE GOOGLE API TOKEN
//     ------------------------------
//     const now = Math.floor(Date.now() / 1000);

//     const jwtPayload = {
//       iss: creds.client_email,
//       scope: "https://www.googleapis.com/auth/spreadsheets",
//       aud: "https://oauth2.googleapis.com/token",
//       exp: now + 3600,
//       iat: now,
//     };

//     const jwtHeader = {
//       alg: "RS256" as const,
//       typ: "JWT" as const,
//     };

//     // private key text -> clean -> decode base64
//     const privateKeyClean = creds.private_key
//       .replace("-----BEGIN PRIVATE KEY-----", "")
//       .replace("-----END PRIVATE KEY-----", "")
//       .replace(/\s/g, "");

//     const keyBuffer = Uint8Array.from(atob(privateKeyClean), (c) => c.charCodeAt(0));

//     const privateKey = await crypto.subtle.importKey(
//       "pkcs8",
//       keyBuffer,
//       { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
//       false,
//       ["sign"],
//     );

//     const jwt = await create(jwtHeader, jwtPayload, privateKey);

//     // exchange jwt → google token
//     const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//         assertion: jwt,
//       }),
//     });

//     const { access_token } = await tokenRes.json();

//     const authHeaders = {
//       "Authorization": `Bearer ${access_token}`,
//       "Content-Type": "application/json",
//     };

//     const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;

//     // -----------------------------
//     // ACTION HANDLERS
//     // -----------------------------

//     // SAVE DEFAULT SETTINGS
//     if (action === "saveDefaults") {
//       const values = [
//         [defaults.date || ""],
//         [defaults.location || ""],
//         [defaults.mediaUrl || ""],
//       ];

//       await fetch(`${baseUrl}/values/Sheet1!Z1:Z3?valueInputOption=RAW`, {
//         method: "PUT",
//         headers: authHeaders,
//         body: JSON.stringify({ values }),
//       });

//       return json({ success: true });
//     }

//     // GET DEFAULTS
//     if (action === "getDefaults") {
//       const res = await fetch(`${baseUrl}/values/Sheet1!Z1:Z3`, {
//         headers: authHeaders,
//       });

//       const sheet = await res.json();

//       const v = sheet.values || [];

//       return json({
//         defaults: {
//           date: v[0]?.[0] || "",
//           location: v[1]?.[0] || "",
//           mediaUrl: v[2]?.[0] || "",
//         },
//       });
//     }

//     // SAVE TEMPLATE
//     if (action === "saveTemplate") {
//       const values = [[template || ""]];
//       await fetch(`${baseUrl}/values/Sheet1!Z4?valueInputOption=RAW`, {
//         method: "PUT",
//         headers: authHeaders,
//         body: JSON.stringify({ values }),
//       });
//       return json({ success: true });
//     }

//     // GET TEMPLATE
//     if (action === "getTemplate") {
//       const res = await fetch(`${baseUrl}/values/Sheet1!Z4`, {
//         headers: authHeaders,
//       });

//       const data = await res.json();

//       return json({
//         template: data?.values?.[0]?.[0] || "",
//       });
//     }

//     // -----------------------------
//     // SUBMIT LEAD (APPEND)
//     // -----------------------------
//     if (action === "submit") {
//       // PREVENT EMPTY ROW BUG
//       if (!lead || !lead.name || !lead.phone) {
//         return json({ error: "INVALID_LEAD" }, 400);
//       }

//       const timestamp = new Date().toISOString();

//       const row = [
//         timestamp,
//         lead.name || "",
//         lead.phone || "",
//         lead.comment || "",
//         lead.whoMet || "",
//         lead.date || "",
//         lead.location || "",
//         "", "", "", // FollowUp1
//         "", "", "", // FollowUp2
//         "", "", "", // FollowUp3
//         "", "", "", // FollowUp4
//         lead.status || "",
//         lead.lead_type || "",
//       ];

//       await fetch(
//         `${baseUrl}/values/Sheet1!A:U:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
//         {
//           method: "POST",
//           headers: authHeaders,
//           body: JSON.stringify({ values: [row] }),
//         },
//       );

//       return json({ success: true });
//     }

//     // -----------------------------
//     // GET RECENT 10 LEADS
//     // -----------------------------
//     if (action === "getRecent") {
//       const res = await fetch(`${baseUrl}/values/Sheet1!A:U`, {
//         headers: authHeaders,
//       });

//       const data = await res.json();
//       const rows = data.values || [];

//       // remove header if exists
//       const hasHeader = rows[0]?.[0] === "Timestamp";
//       const entries = hasHeader ? rows.slice(1) : rows;

//       // remove blank rows (IMPORTANT FIX)
//       const clean = entries.filter((r) => r.some((c) => c && c.trim() !== ""));

//       const last10 = clean.slice(-10).reverse();

//       const leads = last10.map(formatRowToLead);

//       return json({ leads });
//     }

//     // -----------------------------
//     // GET ALL
//     // -----------------------------
//     if (action === "getAll") {
//       const res = await fetch(`${baseUrl}/values/Sheet1!A:U`, {
//         headers: authHeaders,
//       });

//       const data = await res.json();
//       const rows = data.values || [];

//       const hasHeader = rows[0]?.[0] === "Timestamp";
//       const entries = hasHeader ? rows.slice(1) : rows;

//       const clean = entries.filter((r) => r.some((c) => c && c.trim() !== ""));

//       const leads = clean.map((r, idx) => ({
//         ...formatRowToLead(r),
//         rowNumber: hasHeader ? idx + 2 : idx + 1,
//       }));

//       return json({ leads });
//     }

//     // -----------------------------
//     // UPDATE ROW
//     // -----------------------------
//     if (action === "update") {
//       if (!index || !lead) return json({ error: "INVALID_UPDATE" }, 400);

//       const row = [
//         lead.timestamp || new Date().toISOString(),
//         lead.name || "",
//         lead.phone || "",
//         lead.comment || "",
//         lead.whoMet || "",
//         lead.date || "",
//         lead.location || "",
//         lead.followUp1?.comment || "",
//         lead.followUp1?.date || "",
//         lead.followUp1?.whoCalled || "",
//         lead.followUp2?.comment || "",
//         lead.followUp2?.date || "",
//         lead.followUp2?.whoCalled || "",
//         lead.followUp3?.comment || "",
//         lead.followUp3?.date || "",
//         lead.followUp3?.whoCalled || "",
//         lead.followUp4?.comment || "",
//         lead.followUp4?.date || "",
//         lead.followUp4?.whoCalled || "",
//         lead.status || "",
//         lead.lead_type || "",
//       ];

//       await fetch(
//         `${baseUrl}/values/Sheet1!A${index}:U${index}?valueInputOption=RAW`,
//         {
//           method: "PUT",
//           headers: authHeaders,
//           body: JSON.stringify({ values: [row] }),
//         },
//       );

//       return json({ success: true });
//     }

//     return json({ error: "INVALID_ACTION" }, 400);

//   } catch (err) {
//     return json({ error: err?.message || "Unknown error" }, 500);
//   }
// });

// // -----------------------------
// // HELPERS
// // -----------------------------
// function json(body: unknown, status = 200) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: { ...corsHeaders, "Content-Type": "application/json" },
//   });
// }

// function formatRowToLead(row: string[]) {
//   return {
//     timestamp: row[0] || "",
//     name: row[1] || "",
//     phone: row[2] || "",
//     comment: row[3] || "",
//     whoMet: row[4] || "",
//     date: row[5] || "",
//     location: row[6] || "",
//     followUp1: row[7] || row[8] || row[9] ? {
//       comment: row[7] || "",
//       date: row[8] || "",
//       whoCalled: row[9] || "",
//     } : undefined,
//     followUp2: row[10] || row[11] || row[12] ? {
//       comment: row[10] || "",
//       date: row[11] || "",
//       whoCalled: row[12] || "",
//     } : undefined,
//     followUp3: row[13] || row[14] || row[15] ? {
//       comment: row[13] || "",
//       date: row[14] || "",
//       whoCalled: row[15] || "",
//     } : undefined,
//     followUp4: row[16] || row[17] || row[18] ? {
//       comment: row[16] || "",
//       date: row[17] || "",
//       whoCalled: row[18] || "",
//     } : undefined,
//     status: row[19] || "",
//     lead_type: row[20] || "",
//   };
// }


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FollowUp {
  comment: string;
  date: string;
  whoCalled: string;
}

interface Lead {
  name: string;
  phone: string;
  comment: string;
  location: string;
  whoMet: string;
  date: string;
  timestamp: string;
  status?: string;
  followUp1?: FollowUp;
  followUp2?: FollowUp;
  followUp3?: FollowUp;
  followUp4?: FollowUp;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting sheets-manager function');
    
    const { action, lead, index, defaults, template } = await req.json();
    console.log('Action:', action);

    // Get credentials from environment
    const credentialsJson = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    if (!credentialsJson || !sheetId) {
      throw new Error('Missing Google Sheets credentials or sheet ID');
    }

    const credentials = JSON.parse(credentialsJson);
    console.log('Credentials loaded, project:', credentials.project_id);

    // Create JWT for Google Sheets API
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const header = {
      alg: 'RS256' as const,
      typ: 'JWT' as const,
    };

    // Import the private key - properly extract base64 content
    const privateKeyPem = credentials.private_key;
    
    // Remove PEM headers, footers, and all whitespace
    const base64Content = privateKeyPem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');

    // Decode base64 to binary
    const binaryDer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    const jwt = await create(header, payload, privateKey);
    console.log('JWT created');

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();
    console.log('Access token obtained');

    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
    const headers = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    };

    // Handle different actions
    if (action === 'saveDefaults') {
      console.log('Saving default settings');
      // Z1: date, Z2: location, Z3: mediaUrl
      const values = [[defaults.date || ''], [defaults.location || ''], [defaults.mediaUrl || '']];
      const response = await fetch(`${baseUrl}/values/Sheet1!Z1:Z3?valueInputOption=RAW`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save defaults error:', errorText);
        throw new Error('Failed to save defaults');
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getDefaults') {
      console.log('Fetching default settings');
      const response = await fetch(`${baseUrl}/values/Sheet1!Z1:Z3`, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get defaults error:', errorText);
        throw new Error('Failed to fetch defaults');
      }
      const data = await response.json();
      const values = data.values || [];
      const defaults = {
        date: values[0]?.[0] || '',
        location: values[1]?.[0] || '',
        mediaUrl: values[2]?.[0] || '',
      };
      return new Response(JSON.stringify({ defaults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'saveTemplate') {
      console.log('Saving WhatsApp template');
      const values = [[template || '']];
      const response = await fetch(`${baseUrl}/values/Sheet1!Z4?valueInputOption=RAW`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ values }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save template error:', errorText);
        throw new Error('Failed to save template');
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getTemplate') {
      console.log('Fetching WhatsApp template');
      const response = await fetch(`${baseUrl}/values/Sheet1!Z4`, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get template error:', errorText);
        throw new Error('Failed to fetch template');
      }
      const data = await response.json();
      const template = (data.values?.[0]?.[0]) || '';
      return new Response(JSON.stringify({ template }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'submit') {
      console.log('Submitting new lead:', lead);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const values = [[
        timestamp,
        lead.name,
        lead.phone,
        lead.comment,
        lead.whoMet,
        lead.date || '',
        lead.location,
        '', '', '', // FollowUp1
        '', '', '', // FollowUp2
        '', '', '', // FollowUp3
        '', '', '', // FollowUp4
        '', // Status
      ]];

      const response = await fetch(`${baseUrl}/values/Sheet1!A:T:append?valueInputOption=RAW`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Append error:', errorText);
        throw new Error('Failed to append to sheet');
      }

      console.log('Lead submitted successfully');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getRecent') {
      console.log('Fetching recent leads');
      
      const response = await fetch(`${baseUrl}/values/Sheet1!A:T`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get error:', errorText);
        throw new Error('Failed to fetch from sheet');
      }

      const data = await response.json();
      const rows = data.values || [];
      
      // Get last 10 entries (excluding header if exists)
      const hasHeader = rows[0] && rows[0][0] === 'Timestamp';
      const dataRows = hasHeader ? rows.slice(1) : rows;
      const recentRows = dataRows.slice(-10).reverse();

      const leads: Lead[] = recentRows.map((row: string[]) => ({
        timestamp: row[0] || '',
        name: row[1] || '',
        phone: row[2] || '',
        comment: row[3] || '',
        whoMet: row[4] || '',
        date: row[5] || '',
        location: row[6] || '',
        followUp1: row[7] || row[8] || row[9] ? { comment: row[7] || '', date: row[8] || '', whoCalled: row[9] || '' } : undefined,
        followUp2: row[10] || row[11] || row[12] ? { comment: row[10] || '', date: row[11] || '', whoCalled: row[12] || '' } : undefined,
        followUp3: row[13] || row[14] || row[15] ? { comment: row[13] || '', date: row[14] || '', whoCalled: row[15] || '' } : undefined,
        followUp4: row[16] || row[17] || row[18] ? { comment: row[16] || '', date: row[17] || '', whoCalled: row[18] || '' } : undefined,
        status: row[19] || '',
      }));

      console.log('Returning', leads.length, 'recent leads');
      return new Response(JSON.stringify({ leads }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getAll') {
      console.log('Fetching all leads');
      
      const response = await fetch(`${baseUrl}/values/Sheet1!A:T`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get error:', errorText);
        throw new Error('Failed to fetch from sheet');
      }

      const data = await response.json();
      const rows = data.values || [];
      
      // Skip header if exists
      const hasHeader = rows[0] && rows[0][0] === 'Timestamp';
      const dataRows = hasHeader ? rows.slice(1) : rows;
      const startRow = hasHeader ? 2 : 1;

      const leads = dataRows.map((row: string[], idx: number) => ({
        timestamp: row[0] || '',
        name: row[1] || '',
        phone: row[2] || '',
        comment: row[3] || '',
        whoMet: row[4] || '',
        date: row[5] || '',
        location: row[6] || '',
        followUp1: row[7] || row[8] || row[9] ? { comment: row[7] || '', date: row[8] || '', whoCalled: row[9] || '' } : undefined,
        followUp2: row[10] || row[11] || row[12] ? { comment: row[10] || '', date: row[11] || '', whoCalled: row[12] || '' } : undefined,
        followUp3: row[13] || row[14] || row[15] ? { comment: row[13] || '', date: row[14] || '', whoCalled: row[15] || '' } : undefined,
        followUp4: row[16] || row[17] || row[18] ? { comment: row[16] || '', date: row[17] || '', whoCalled: row[18] || '' } : undefined,
        status: row[19] || '',
        rowNumber: startRow + idx,
      }));

      console.log('Returning', leads.length, 'total leads');
      return new Response(JSON.stringify({ leads }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      console.log('Updating lead at index:', index);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const values = [[
        lead.timestamp || timestamp,
        lead.name,
        lead.phone,
        lead.comment,
        lead.whoMet,
        lead.date || '',
        lead.location,
        lead.followUp1?.comment || '',
        lead.followUp1?.date || '',
        lead.followUp1?.whoCalled || '',
        lead.followUp2?.comment || '',
        lead.followUp2?.date || '',
        lead.followUp2?.whoCalled || '',
        lead.followUp3?.comment || '',
        lead.followUp3?.date || '',
        lead.followUp3?.whoCalled || '',
        lead.followUp4?.comment || '',
        lead.followUp4?.date || '',
        lead.followUp4?.whoCalled || '',
        lead.status || '',
      ]];

      // Calculate row number (add 1 for header if exists, add 1 for 1-based indexing)
      const rowNumber = index;
      
      const response = await fetch(
        `${baseUrl}/values/Sheet1!A${rowNumber}:T${rowNumber}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ values }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error:', errorText);
        throw new Error('Failed to update sheet');
      }

      console.log('Lead updated successfully');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in sheets-manager:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
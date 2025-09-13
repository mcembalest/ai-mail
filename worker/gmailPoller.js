import dotenv from "dotenv";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { sendReply } from "../lib/mailer.js";
import { processEmail } from "../lib/processEmail.js";

dotenv.config();

const {
  IMAP_USER,
  IMAP_PASS,
  SMTP_USER, // used to ignore self-sent mail
  POLL_INTERVAL_MS = "10000",
} = process.env;

if (!IMAP_USER || !IMAP_PASS) {
  console.error("[poller] Missing IMAP_USER/IMAP_PASS in environment");
}

const INTERVAL = Number(POLL_INTERVAL_MS) || 10000;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function pollOnce(client) {
  // Open INBOX and process unseen messages
  await client.mailboxOpen("INBOX");
  const unseen = await client.search({ seen: false });

  if (!unseen || unseen.length === 0) return;

  for await (const msg of client.fetch(unseen, { envelope: true, source: true })) {
    const fromAddr = msg?.envelope?.from?.[0]?.address?.toLowerCase?.() || "";
    const toAddr = msg?.envelope?.to?.[0]?.address || "";

    // Skip messages sent by ourselves to avoid loops
    if (fromAddr && SMTP_USER && fromAddr === SMTP_USER.toLowerCase()) {
      await client.messageFlagsAdd(msg.seq, ["\\Seen"]);
      continue;
    }

    // Parse full message to get body + headers
    let parsed;
    try {
      parsed = await simpleParser(msg.source);
    } catch (err) {
      console.error("[poller] Failed to parse message", err);
      await client.messageFlagsAdd(msg.seq, ["\\Seen"]);
      continue;
    }

    const subject = parsed.subject || msg?.envelope?.subject || "";
    const messageId = parsed.messageId || msg?.envelope?.messageId || undefined;
    const from = parsed.from?.value?.[0]?.address || fromAddr;
    const to = parsed.to?.value?.[0]?.address || toAddr;
    const text = parsed.text || parsed.html || "";

    try {
      const aiText = await processEmail({ from, to, subject, text });

      await sendReply({
        to: from,
        subject,
        text: aiText,
        inReplyTo: messageId,
        references: messageId,
      });

      console.log(`[poller] Replied to ${from} (subject: ${subject || "(no subject)"})`);
    } catch (err) {
      console.error("[poller] Failed processing/sending reply:", err);
    } finally {
      // Mark as seen to avoid reprocessing
      try {
        await client.messageFlagsAdd(msg.seq, ["\\Seen"]);
      } catch (e) {
        // ignore
      }
    }
  }
}

async function run() {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: IMAP_USER,
      pass: IMAP_PASS,
    },
    logger: false,
  });

  client.on("error", (err) => {
    console.error("[poller] IMAP error:", err);
  });

  try {
    await client.connect();
    console.log("[poller] Connected to Gmail IMAP as", IMAP_USER);

    while (true) {
      try {
        await pollOnce(client);
      } catch (err) {
        console.error("[poller] Poll error:", err);
      }
      await sleep(INTERVAL);
    }
  } catch (err) {
    console.error("[poller] Fatal error:", err);
  } finally {
    try {
      await client.logout();
    } catch (e) {}
  }
}

process.on("SIGINT", () => {
  console.log("\n[poller] Caught SIGINT, exiting...");
  process.exit(0);
});

run();

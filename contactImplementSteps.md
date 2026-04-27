# Contact Form — Implementation Steps

Purpose: notify owner and provide an easy inbox for viewing inquiries.

1) Choose a provider (quick/no-backend)
- Recommended: Formspree. Alternatives: Basin, Web3Forms.
- Sign up and create a form; copy the endpoint (example: https://formspree.io/f/your-id).

2) Integration approach
- Quick (HTML only): set `<form action="https://formspree.io/f/your-id" method="POST">` in `pages/contact.html`.
- Recommended (keep current validation): use `fetch` in `js/script.js` after validation passes.

3) Edit `js/script.js` (fetch pattern)
- Replace the existing submit listener with the following (update endpoint):

```javascript
const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-id";

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const valid = Object.keys(fields).every(validateField);
  if (!valid) {
    if (success) success.textContent = "";
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  if (success) success.textContent = "Sending…";

  try {
    const formData = new FormData(contactForm);
    const resp = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (resp.ok) {
      contactForm.reset();
      Object.keys(fields).forEach((name) => setError(name, ""));
      if (success)
        success.textContent =
          "Thank you. Your cake inquiry is ready for Bee Cakes to review.";
    } else {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.error || "Submission failed.");
    }
  } catch (err) {
    if (success) success.textContent = "Sorry — something went wrong. Try again.";
    console.error("Contact submit error:", err);
  } finally {
    submitBtn.disabled = false;
  }
});
```

4) Configure owner notifications
- In provider dashboard add owner email(s) and enable instant notifications.
- Optionally add CCs or forwarding rules.

5) Optional automations
- Use Zapier/Make to forward to WhatsApp/Telegram, append to Google Sheets, or create Trello/Asana tasks.

6) Self-hosted alternative (more control)
- Create a serverless endpoint (Vercel/Netlify/AWS Lambda) to receive POSTs.
- Store submissions in Supabase/Firebase or a small DB.
- Send owner emails via SendGrid or Mailgun.
- Build a protected admin page to view/filter inquiries.

7) Testing checklist
- Submit test inquiry and confirm owner receives email.
- Confirm provider dashboard shows the entry.
- Test network failure to verify user-facing error message.

8) Security & privacy
- Enable provider spam protection (reCAPTCHA or honeypot).
- Ensure owner email is private; include minimal personally-identifiable data retention rules.
- If storing data, use HTTPS everywhere and limit access to admin only.

9) Owner convenience improvements
- Include `name`, `cakeType`, and timestamp in notification subject.
- Add an unread/new marker in dashboard or email subject (use provider rules or Zapier).
- Consider SMS or WhatsApp for urgent inquiries.

---

If you'd like, I can also:
- Patch `js/script.js` with the fetch code (I will create a patch you can commit), or
- Use the HTML `action` approach instead and show that minimal change.

Tell me which change you want me to apply next.
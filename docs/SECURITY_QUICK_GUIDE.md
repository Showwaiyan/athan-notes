# 🔒 Security Quick Guide

**For Users Who Want the Short Version**

---

## 🎯 TL;DR - Stay Safe

### ✅ DO These Things

1. **Lock Your Device**
   - Use Face ID, Touch ID, or strong passcode
   - Auto-lock after 1-2 minutes

2. **Logout When Done**
   - Click the "Logout" button
   - Especially on shared devices

3. **Use Strong Password**
   - At least 12 characters
   - Mix letters, numbers, symbols
   - Don't reuse from other accounts

4. **Keep Secrets Secret**
   - Never share your password
   - Never share your `.env.local` file
   - Never commit secrets to Git

5. **Update Regularly**
   - Keep browser updated
   - Keep OS updated
   - Install security patches

### ❌ DON'T Do These Things

1. **Don't Use on Public Computers**
   - Library, internet cafe, friend's laptop → ❌
   - Your personal phone/laptop → ✅

2. **Don't Share Cookies**
   - Even with friends
   - Cookie = Full access (no password needed)

3. **Don't Install Sketchy Extensions**
   - Only from official Chrome/Firefox stores
   - Check reviews first

4. **Don't Leave Device Unlocked**
   - Someone can copy your session cookie
   - Instant access for 4 days

5. **Don't Ignore Weird Activity**
   - Unexpected notes in Notion → Investigate
   - Sudden logout → Check for compromise

---

## 🆘 Emergency: What If I'm Hacked?

### Immediate Actions (Do in 5 minutes)

```
☐ 1. Logout from app immediately
☐ 2. Change password (npm run hash-password)
☐ 3. Revoke Notion API key (notion.so/my-integrations)
☐ 4. Revoke Gemini API key (aistudio.google.com/apikey)
☐ 5. Create new keys and update your deployment server
☐ 6. Check Notion for suspicious notes
☐ 7. Run antivirus scan on device
```

### Follow-Up Actions (Next 24 hours)

```
☐ Check browser for malicious extensions
☐ Review recently installed apps
☐ Monitor Gemini API usage
☐ Change password again (if still paranoid)
☐ Generate new SESSION_SECRET
☐ Document what happened
```

---

## 🔐 How Secure Is This App?

### What's Protected ✅

| Feature | Protection | Safe? |
|---------|------------|-------|
| Voice recordings | HTTPS encryption | ✅ Yes |
| Password | bcrypt hashing | ✅ Yes |
| Session | Encrypted cookies | ✅ Yes |
| API keys | your deployment server secrets | ✅ Yes |
| Network traffic | HTTPS/TLS 1.3 | ✅ Yes |

### What Can Go Wrong ⚠️

| Risk | How It Happens | How To Prevent |
|------|----------------|----------------|
| Cookie theft | Device stolen/unlocked | Lock device, logout when done |
| Password leak | Weak password | Use strong password (12+ chars) |
| API key leak | Git commit | Never commit .env.local |
| Malware | Sketchy extension | Only install trusted software |
| Physical access | Someone uses your device | Lock screen, don't share device |

---

## 💡 Simple Security Rules

### The 3 Golden Rules

1. **Your Device = Your Responsibility**
   - Keep it locked
   - Keep it updated
   - Keep it private

2. **Your Credentials = Your Power**
   - Strong password
   - Never share
   - Change if compromised

3. **When In Doubt, Logout**
   - Finished using app? Logout.
   - Suspicious activity? Logout.
   - Leaving device? Logout.

---

## 🎓 Understanding Session Cookies

### Simple Explanation

```
Login with password
       ↓
Server creates encrypted "ticket" (cookie)
       ↓
Browser saves ticket
       ↓
Every visit: Show ticket instead of password
       ↓
Ticket expires after 4 days
```

### Why This Matters

**Good:**
- ✅ Don't need to enter password every time
- ✅ Convenient for daily use
- ✅ Encrypted (can't be forged)

**Risk:**
- ⚠️ Anyone with ticket can access (no password needed)
- ⚠️ Must keep ticket safe (= keep device locked)

**Think of it like a hotel key card:**
- Password = Check-in at front desk
- Cookie = Key card to your room
- Logout = Return key card at checkout

**If someone steals your key card:**
- ✅ They can enter your room
- ❌ They can't create new key cards
- ✅ Card expires after 4 days

---

## 📱 Device-Specific Tips

### iPhone/iPad

```
Settings → Face ID & Passcode
☐ Require passcode immediately
☐ Erase data after 10 failed attempts (optional)
☐ Auto-lock: 1 minute

Safari → Settings → Privacy
☐ Prevent Cross-Site Tracking: ON
☐ Block All Cookies: OFF (app needs cookies)
```

### Android

```
Settings → Security → Screen Lock
☐ Use fingerprint or strong PIN
☐ Lock automatically: After 30 seconds

Chrome → Settings → Privacy and Security
☐ Always use secure connections: ON
☐ Safe Browsing: Standard protection
```

### Mac

```
System Preferences → Security & Privacy
☐ Require password immediately after sleep
☐ Disable automatic login
☐ FileVault: ON (disk encryption)

Safari → Preferences → Privacy
☐ Prevent cross-site tracking: ON
```

### Windows

```
Settings → Accounts → Sign-in Options
☐ Require Windows Hello or password
☐ Dynamic lock: ON (auto-lock when Bluetooth device leaves)

Edge → Settings → Privacy
☐ Tracking prevention: Balanced
☐ Always use secure connections: ON
```

---

## 🔍 Monthly Security Checklist

### First Sunday of Every Month (10 minutes)

```
☐ Check Notion for unexpected notes
☐ Review Gemini API usage
☐ Check browser for unknown extensions
☐ Update browser to latest version
☐ Update OS to latest version
☐ Verify .env.local is not in Git
☐ Test logout button works
☐ Confirm app uses HTTPS (padlock icon)
```

### Every 6 Months (30 minutes)

```
☐ Change password (npm run hash-password)
☐ Rotate Notion API key
☐ Rotate Gemini API key
☐ Generate new SESSION_SECRET
☐ Update all your deployment server environment variables
☐ Review your deployment server deployment logs
☐ Clean up old Notion notes
☐ Backup important notes elsewhere
```

---

## ❓ Common Questions (Quick Answers)

**Q: Is my data encrypted?**  
A: Yes. HTTPS encrypts transmission. Cookies are encrypted with AES-256.

**Q: Can Google/Notion see my notes?**  
A: Yes. Gemini transcribes audio. Notion stores notes. This is required for functionality.

**Q: Can someone hack me with just my URL?**  
A: No. They still need to login (password required).

**Q: What if I forget to logout?**  
A: Cookie expires after 4 days automatically. But always logout manually.

**Q: Is this app secure for work notes?**  
A: Yes, for general productivity. No, for classified/HIPAA/financial data.

**Q: Do I need antivirus?**  
A: Good practice, but app itself is secure. Antivirus protects your device.

**Q: Can I use this on work WiFi?**  
A: Yes. HTTPS encrypts everything. IT can see you're using the app, but not the content.

**Q: What's the weakest security link?**  
A: Your device being unlocked/stolen. Always lock your screen!

---

## 📞 Need Help?

### Security Concern?
- Read full documentation: `docs/SECURITY.md`
- Report privately to developer (don't open public issue)

### General Questions?
- Check `README.md`
- Check `AGENTS.md` for technical details
- Open GitHub issue

---

## ✅ Security Checklist (Before First Use)

```
☐ Changed default password to strong password
☐ Verified .env.local is in .gitignore
☐ Confirmed app uses HTTPS (your deployment server URL)
☐ Set device auto-lock to 1-2 minutes
☐ Enabled device passcode/biometric
☐ Removed unnecessary browser extensions
☐ Updated browser to latest version
☐ Understand how to logout
☐ Know what to do if hacked (see above)
☐ Read this guide and SECURITY.md
```

**If all checked ✅ → You're ready to use the app securely!**

---

**Remember:** 
- 🔒 Lock your device
- 🚪 Logout when done
- 💪 Use strong password
- 👀 Watch for suspicious activity

**You're the most important part of security!**

---

Last Updated: January 19, 2025

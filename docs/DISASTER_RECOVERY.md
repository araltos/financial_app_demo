# Disaster Recovery Plan - FinTrack Demo

## Database Backup Strategy

### Automated Backups
- **Service:** Google Cloud SQL
- **Frequency:** Daily automated backups at 3:00 AM UTC
- **Retention:** 7 days
- **Point-in-time recovery:** Enabled (allows restoration to any minute within the last 7 days)

### Manual Backup Procedure
1. Go to [GCP Console → SQL](https://console.cloud.google.com/sql)
2. Select the database instance
3. Click **Backups** tab
4. Click **CREATE BACKUP**
5. Add description (e.g., "Pre-deployment backup")

### Restoration Procedure
**If database is corrupted or data is lost:**

1. Go to GCP Console → SQL → Select instance
2. Click **Backups** tab
3. Find the backup to restore from
4. Click **⋮** (three dots) → **Restore**
5. Choose:
   - **Restore to the same instance** (overwrites current data)
   - **Restore to a new instance** (safer, allows comparison)
6. Confirm and wait for restoration (5-15 minutes)
7. Update backend service environment variables if using new instance

## Frontend Backup & Recovery

### Code Repository
- **Primary:** GitHub (`financial_app_demo` repo)
- **Backup:** Automatic GitHub backups
- **Recovery:** Clone repo and redeploy via GitHub Actions

### Firebase Hosting Recovery
**If hosting fails:**
1. Check Firebase Console for service status
2. Redeploy via GitHub Actions:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
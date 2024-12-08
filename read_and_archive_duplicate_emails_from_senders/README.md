# read_and_archive_duplicate_emails_from_senders.gs
Function to mark-as-read and archive duplicate emails in the inbox from a list of senders.

# How it works
Inbox emails will be processed from newest to oldest. An email found with the same sender and subject as an email already processed will be considered a duplicate, marked as read, and moved to the archive. Only the "most recent version" of an email will remain in the inbox.

# Quickstart

## Bootstrap
1. Open [Google Apps Scripts](https://script.google.com/)
2. Click `New Project`
3. copy-paste code here
4. name project something like `gmail_scripts`
5. name file something like `read_and_archive_duplicate_emails_from_senders`
6. update $senderFilter to include the senders for which you would like to handle duplicates
7. Click `Run` or `Debug` to test locally. Feel free to add log statements. Recommend commenting out thread.markRead() and thread.moveToArchive() while testing.
8. Make sure to grant any necessary permissions to Google App Scripts.

## Deployment
9. From the left sidebar, click `Triggers`
10. Click `Add Trigger`

### Trigger Configuration

This is my cron configuration. I attempt to balance frequency with functional need. Make sure to consider [quotas for Google App Scripts](https://developers.google.com/apps-script/guides/services/quotas).

11. For `Choose which function to run`, select `readAndArchiveDuplicateEmailsFromSenders`
12. For `Choose which deployment should run`, select `HEAD`
13. For `Select event source`, select `Time-driven`
14. For `Select type of time based trigger`, select `Minutes timer`
15. For `Select minute interval`, select `Every 10 minutes`

## Visibility
To confirm setup and view the results of your script execution, see https://script.google.com/home/executions. Executions will include start-time, status, and logs.

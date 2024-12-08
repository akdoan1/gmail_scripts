const emailCounts = {};
const senderFilter = [
  "gitlab@mg.gitlab.com",
];

const inboxQuery = "in:inbox"
const senderQuery = senderFilter.map(sender => `from:${sender}`).join(" OR ");
const query = `${inboxQuery} ${senderQuery}`.trim();


function readAndArchiveDuplicateEmailsFromSenders() {
  Logger.log(`Running search with query: [${query}]`);
  const threads = GmailApp.search(query);

  threads.forEach(thread => {
    const firstMessage = thread.getMessages()[0];
    const sender = firstMessage.getFrom();
    const key = `${firstMessage.getSubject()}::${sender}`

    if (senderFilter.some(allowed => sender.includes(allowed))) {
      if (emailCounts[key] && !firstMessage.isStarred()) {
        Logger.log(`Found duplicate: [${key}]. Archiving and marking as read`);
        thread.markRead();
        thread.moveToArchive();
        emailCounts[key] = emailCounts[key] + 1;
      } else {
        emailCounts[key] = 1;
      }
    }
  })

  const modifiedEmailCount = 0;
  for (const key in emailCounts) {
    const count = emailCounts[key];
    if (count > 1) {
      const modifiedCount = count - 1
      Logger.info(`key: [${key}] - archived count: [${modifiedCount}]`);
      modifiedEmailCount = modifiedEmailCount + modifiedCount;
    }
  }

  Logger.info(`Found [${threads.length}] emails from query. Modified [${modifiedEmailCount}] emails.`)
}

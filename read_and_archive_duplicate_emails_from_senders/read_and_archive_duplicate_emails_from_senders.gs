const DEBUG_MODE = false;
const emailCounts = {};
const senderFilter = [
  "alert@dtdg.co",
  "gitlab@mg.gitlab.com",
  "notifier@mail.rollbar.com",
  "alexdoan15@gmail.com"
];

const inboxQuery = "in:inbox"
const senderQuery = senderFilter.map(sender => `from:${sender}`).join(" OR ");
const query = `${inboxQuery} ${senderQuery}`.trim();

function readAndDeleteDuplicateEmailsFromSenders() {
  Logger.log(`Running search with query: [${query}]`);
  const threads = GmailApp.search(query);
  var inboxSize = 0;
  var modifiedEmailCount = 0;

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      if (message.isInInbox()) {
        inboxSize = inboxSize + 1;
        const sender = extractSenderEmail(message.getFrom());

        if (senderFilter.some(allowed => sender.includes(allowed))) {
          const key = `${message.getSubject()}::${sender}`

          if (emailCounts[key] && !message.isStarred()) {
            emailCounts[key] = emailCounts[key] + 1;
            Logger.log(`Found duplicate: [${key}]`);

            if (!DEBUG_MODE) {
              message.markRead();
              Logger.log("Marked as read.");
              message.moveToTrash();
              Logger.log("Deleted.");
            }
          } else {
            emailCounts[key] = 1;
          }
        }
      }

    })
  })

  for (const key in emailCounts) {
    const count = emailCounts[key];
    if (count > 1) {
      const modifiedCount = count - 1
      Logger.info(`key: [${key}] - delete count: [${modifiedCount}]`);
      modifiedEmailCount = modifiedEmailCount + modifiedCount;
    }
  }

  Logger.info(`For query, found [${inboxSize}] inbox emails and [${threads.length}] threads. Modified [${modifiedEmailCount}] emails.`);
}

function extractSenderEmail(sender) {
  const match = sender.match(/<(.*?)>/); // Extract email part within <>
  return match ? match[1] : sender; // If no match, return the sender as is
}

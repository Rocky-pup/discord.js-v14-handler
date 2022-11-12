module.exports = async (client) => {
    process.on('unhandledRejection', (reason, p) => {
        console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
        console.log('Reason: ', reason);
        console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
        client.webhook(true, "unhandledRejection", reason)
      });
      process.on("uncaughtException", (err, origin) => {
        console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
        console.log('Exception: ', err.stack ? err.stack : err)
        console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
        client.webhook(true, "uncaughtException", err)
      })
}
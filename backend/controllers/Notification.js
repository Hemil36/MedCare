export function scheduleNotification(appointment) {
    const { _id, date } = appointment;
    const id = _id;
    const time = date.toLocaleTimeString();
    const dateTime = `${date} ${time}`;
  
    if (moment(dateTime).isAfter(moment())) {
      const appointmentDate = moment(dateTime).toDate();
  
      if (scheduledTasks.has(id)) {
        scheduledTasks.get(id).stop();
        scheduledTasks.delete(id);
      }
  
      const job = new CronJob(
        appointmentDate,
        async () => {
          console.log(
            `Sending notification for appointment ID ${id} on ${dateTime}`
          );
          const personalizedContent = await run(date);
          const subject = "Reminder: Your Appointment";
          const message = personalizedContent;
  
          await sendEmail(subject, message);
  
          job.stop();
          scheduledTasks.delete(id);
        },
        null,
        true,
        "America/New_York"
      );
  
      scheduledTasks.set(id, job);
      console.log(
        `Scheduled notification for appointment ID ${id} at ${dateTime}`
      );
    } else {
      console.log(`Cannot schedule past appointment for ID ${id} at ${dateTime}`);
    }
  }
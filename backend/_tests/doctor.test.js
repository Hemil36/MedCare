import { CronJob } from "cron";
import { scheduleNotification as scheduleAppointmentNotification } from '../controllers/doctor';
import { sendEmail } from '../controllers/email'; // Adjust the import path as necessary
import { run } from '../controllers/doctor'; // Adjust the import path as necessary


jest.mock('../controllers/doctor', () => ({
  run: jest.fn().mockResolvedValue('Personalized content'),
}));

describe('scheduleAppointmentNotification', () => {
  let scheduledTasks;

  beforeEach(() => {
    scheduledTasks = new Map();
  });

  it('should schedule a notification for a future appointment', async () => {
    const id = 'test-id';
    const dateTime = new Date(Date.now() + 10000); // 10 seconds in the future
    const appointmentDate = dateTime.toISOString();

    await scheduleAppointmentNotification(id, dateTime, appointmentDate, scheduledTasks);

    expect(scheduledTasks.has(id)).toBe(true);
    const job = scheduledTasks.get(id);
    expect(job).toBeInstanceOf(CronJob);

    // Manually trigger the cron job
    job.fireOnTick();

    // Wait for the job to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(sendEmail).toHaveBeenCalledWith(
      'Reminder: Your Appointment',
      'Personalized content'
    );
    expect(scheduledTasks.has(id)).toBe(false);
  });

  it('should not schedule a notification for a past appointment', async () => {
    const id = 'test-id';
    const dateTime = new Date(Date.now() - 10000); // 10 seconds in the past
    const appointmentDate = dateTime.toISOString();

    await scheduleAppointmentNotification(id, dateTime, appointmentDate, scheduledTasks);

    expect(scheduledTasks.has(id)).toBe(false);
  });
});
/**
 * A simple lock manager to serialize canvas drawing requests.
 */
export class DrawingSerializer {
  private readonly queue: Array<{
    task: () => Promise<void> | void;
    canceled: boolean;
  }> = [];

  private running = false;

  acquireAndRun(task: () => Promise<void> | void) {
    const entry = { task, canceled: false };
    this.queue.push(entry);
    this.runQueue();
    return {
      cancel: () => {
        entry.canceled = true;
      },
    };
  }

  private async runQueue() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      const entry = this.queue.shift()!;
      if (entry.canceled) continue;
      try {
        await entry.task();
      } catch (error) {
        console.error("Failed to render", error);
      }
    }
    this.running = false;
  }
}

import { describe, it, expect } from 'vitest';
import { computeStats } from '@knowthemd/markdown-engine';

describe('Editor State & Recovery Draft Logic', () => {
  it('handles dirty state and content update tracking', () => {
    let content = '# Initial';
    let isDirty = false;

    const update = (next: string) => {
      content = next;
      isDirty = true;
    };

    const save = () => {
      isDirty = false;
    };

    update('# Modified Content');
    expect(content).toBe('# Modified Content');
    expect(isDirty).toBe(true);

    save();
    expect(isDirty).toBe(false);
  });

  it('verifies undo and redo stack behavior', () => {
    const history: string[] = ['A'];
    let index = 0;

    const push = (val: string) => {
      history.splice(index + 1);
      history.push(val);
      index++;
    };

    const undo = () => {
      if (index > 0) index--;
      return history[index];
    };

    const redo = () => {
      if (index < history.length - 1) index++;
      return history[index];
    };

    push('B');
    push('C');
    expect(history[index]).toBe('C');

    expect(undo()).toBe('B');
    expect(undo()).toBe('A');
    expect(redo()).toBe('B');
    expect(redo()).toBe('C');
  });

  it('correctly calculates reading time progression', () => {
    const text200words = Array(200).fill('word').join(' ');
    const text400words = Array(400).fill('word').join(' ');

    expect(computeStats(text200words).readingTimeMinutes).toBe(1);
    expect(computeStats(text400words).readingTimeMinutes).toBe(2);
  });
});

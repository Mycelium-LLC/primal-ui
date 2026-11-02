import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PrimalMask } from './mask';

@Component({ imports: [PrimalMask], template: `<input primalMask="phone" /><input primalMask="email" />` })
class Host {}

const type = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
};

describe('PrimalMask', () => {
  it('shapes a phone number and an email as they are typed', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const [phone, email] = fixture.nativeElement.querySelectorAll('input');
    type(phone, '0501234567');
    expect(phone.value).toBe('050-123-4567');
    type(email, 'Ada Shapiro@Example.COM');
    expect(email.value).toBe('AdaShapiro@example.com');
  });
});

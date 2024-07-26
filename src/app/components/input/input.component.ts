import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  Injector,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  NgControl,
  FormGroupDirective,
  FormControlName,
  FormControlDirective,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string;
  @Input() type: 'text' | 'email' | 'password' | '' = 'text';

  control: AbstractControl | null = null;

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private readonly injector: Injector) {}

  ngOnInit(): void {
    this.getControl();
  }

  writeValue(value: string | null): void {
    this.value = value || '';
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  getControl(): void {
    try {
      const ngControl = this.injector.get(NgControl);
      if (ngControl instanceof FormControlName) {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(ngControl);
        return;
      }
      this.control = (ngControl as FormControlDirective).form as FormControl;
    } catch (error) {
      // No control
      this.control = null;
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(target.value);
    this.onTouched();
  }
}

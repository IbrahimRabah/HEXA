import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';
import { InvoiceStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule, TranslatePipe],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly paymentMethods = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Card', value: 'Card' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Online', value: 'Online' },
  ];

  form = this.fb.group({
    patientName: ['', Validators.required],
    patientId: [''],
    dueDate: ['', Validators.required],
    paymentMethod: ['Cash', Validators.required],
    discount: [0],
    taxPct: [0],
    notes: [''],
    items: this.fb.array([this.newItem()]),
  });

  get itemsArray() { return this.form.get('items') as FormArray; }

  newItem() {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem() { this.itemsArray.push(this.newItem()); }
  removeItem(i: number) { if (this.itemsArray.length > 1) this.itemsArray.removeAt(i); }

  lineTotal(i: number): number {
    const c = this.itemsArray.at(i);
    return (+(c.get('quantity')?.value || 0)) * (+(c.get('unitPrice')?.value || 0));
  }

  get subtotal(): number {
    return this.itemsArray.controls.reduce((s, _, i) => s + this.lineTotal(i), 0);
  }
  get discountAmt(): number { return +(this.form.get('discount')?.value || 0); }
  get taxAmt(): number {
    return (this.subtotal - this.discountAmt) * (+(this.form.get('taxPct')?.value || 0) / 100);
  }
  get grandTotal(): number { return this.subtotal - this.discountAmt + this.taxAmt; }

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const inv = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      patientName: v.patientName,
      patientId: v.patientId,
      dueDate: new Date(v.dueDate!),
      paymentMethod: v.paymentMethod,
      subtotal: this.subtotal,
      discount: this.discountAmt,
      tax: this.taxAmt,
      total: this.grandTotal,
      paidAmount: 0,
      balanceDue: this.grandTotal,
      status: InvoiceStatus.Draft,
      notes: v.notes,
      items: v.items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saved.emit(inv);
    this.toastService.showSuccess('Invoice Created', `${inv.invoiceNumber} created successfully.`);
    while (this.itemsArray.length > 1) this.itemsArray.removeAt(1);
    this.form.reset({ paymentMethod: 'Cash', discount: 0, taxPct: 0 });
    this.itemsArray.at(0).patchValue({ description: '', quantity: 1, unitPrice: 0 });
    this.close();
  }
}

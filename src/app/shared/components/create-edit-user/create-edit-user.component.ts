import { Component, OnInit, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { TUserEntity, TUserVM } from '../../../libs/core/data-access/src/lib/users-data.models';

type FormType<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss'
})
export class CreateEditUserComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateEditUserComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly data: { user: TUserEntity | undefined, isEdit: boolean } = inject(MAT_DIALOG_DATA);

  public readonly isEdit: boolean = this.data.isEdit;
  public readonly formControlBuilder: FormGroup< FormType<TUserVM> > = this.formBuilder.group({
    name: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^.+/)] }),
    email: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^.+/)] }),
    phone: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^.+/)] }),
  });

  ngOnInit(): void {
    if (this.data.user) {
      this.formControlBuilder.patchValue(this.data.user);
    }
  }

  public createEditUser(): void {
    this.formControlBuilder.valid
      ? this.dialogRef.close({ isClosed: false, userForm: this.formControlBuilder.value })
      : alert('Введите корректные данные!');
  }
}


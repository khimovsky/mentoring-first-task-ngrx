import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IUser } from '../../shared/models/user.models';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateEditUserComponent } from '../../shared/components/create-edit-user/create-edit-user.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { MatButton } from "@angular/material/button";
import { Store } from '@ngrx/store';
import * as UsersActions from '../../libs/users/data-access/src/lib/state/users.actions';
import * as UsersSelectors from '../../libs/users/data-access/src/lib/state/users.selectors';
import { USERS_FEATURE_KEY } from '../../libs/users/data-access/src/lib/state/users.selectors';


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent, NgFor, MatButton],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {

  private dialog = inject(MatDialog);
  private dialogRef!: MatDialogRef<CreateEditUserComponent>;

  private readonly store = inject(Store);
  private readonly localStorageService = inject(LocalStorageService);

  public readonly users$ = this.store.select(UsersSelectors.selectAllUsers);

  ngOnInit(): void {
    const users: IUser[] | null = this.localStorageService.getItem(USERS_FEATURE_KEY);
    users && users.length !== 0
      ? this.store.dispatch(UsersActions.setUsers({ users }))
      : this.store.dispatch(UsersActions.loadUsers());
  }

  public openDialog(user?: IUser): void {
    this.dialogRef = this.dialog.open(CreateEditUserComponent, { data: user });
    this.dialogRef.afterClosed().subscribe((isClosed: boolean = true) => {
      const editedUser = this.dialogRef.componentInstance.formControlBuilder.value;
      const editedUserValid = this.dialogRef.componentInstance.formControlBuilder.valid;
      if (user && editedUserValid && !isClosed) {
        this.editUser({ ...user, ...editedUser });
      } else if (editedUserValid && !isClosed) {
        this.addUser(editedUser);
      }
    });
  }

  private addUser(user: IUser): void {
    this.store.dispatch(UsersActions.addUser({ user: { ...user, id: new Date().getTime() } }));
    this.setUsersLocalStorage();
  }

  public deleteUser(id: number): void {
    this.store.dispatch(UsersActions.deleteUser({ id }));
    this.setUsersLocalStorage();
  }

  private editUser(user: IUser): void {
    this.store.dispatch(UsersActions.editUser({ user }));
    this.setUsersLocalStorage();
  }

  private setUsersLocalStorage(): void {
    this.store.select(UsersSelectors.selectAllUsers).subscribe(users => this.localStorageService.setItem(USERS_FEATURE_KEY, users)).unsubscribe();
  }
}

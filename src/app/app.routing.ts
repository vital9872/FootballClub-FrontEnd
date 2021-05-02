import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { PlayersComponent } from './players/players.component';
import { PlayerFormComponent } from './add-player/player-form.component';
import { BroadcastsComponent } from './broadcasts/broadcasts.component';
import { BroadcastFormComponent } from './broadcast-form/broadcast-form.component';
import { MatchesComponent } from './matches/matches.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { MatchViewComponent } from './match-view/match-view.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingFormComponent } from './training-form/training-form.component';
import { TrainingViewComponent } from './training-view/training-view.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentFormComponent } from './payment-form/payment-from.component';
import { IncomesComponent } from './incomes/incomes.component';
import { IncomeFormComponent } from './income-form/income-from.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'players',
                component: PlayersComponent
            },
            {
                path: 'add-player',
                component: PlayerFormComponent
            },
            {
                path: 'broadcasts',
                component: BroadcastsComponent
            },
            {
                path: 'add-broadcast',
                component: BroadcastFormComponent
            },
            {
                path: 'matches',
                component: MatchesComponent
            },
            {
                path: 'add-match',
                component: MatchFormComponent
            },
            { path: 'matches/:id', component: MatchViewComponent },
            {
                path: 'training',
                component: TrainingsComponent
            },
            {
                path: 'add-training',
                component: TrainingFormComponent
            },
            { path: 'training/:id', component: TrainingViewComponent },
            {
                path: 'payment',
                component: PaymentsComponent
            },
            {
                path: 'add-payment',
                component: PaymentFormComponent
            },
            {
                path: 'income',
                component: IncomesComponent
            },
            {
                path: 'add-income',
                component: IncomeFormComponent
            },
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'add-user',
        component: AddUserComponent
    },
    {
        path: 'edit-user',
        component: EditUserComponent
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
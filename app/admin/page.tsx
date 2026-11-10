import {currentAdmin} from '../../lib/admin-auth';
import Admin from './editor';
import LoginForm from './login-form';
import AccountControls from './account-controls';
export const dynamic='force-dynamic';
export const revalidate=0;
export default async function Page(){const user=await currentAdmin();if(!user)return <LoginForm/>;return <><AccountControls email={user.email}/><Admin/></>}

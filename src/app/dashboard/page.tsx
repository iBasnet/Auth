import { getUserToDos } from '@/lib/actions/todo'
import DashboardClient from './dashboard'

export default async function page() {

    const data = await getUserToDos();

    return (
        <DashboardClient todos={data} />
    )
}
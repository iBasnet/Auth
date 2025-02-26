import { getUserToDos } from '@/lib/actions/todo'
import DashboardClient from './DashboardClient'

export default async function page() {

    const fetchedToDos = await getUserToDos();

    return (
        <DashboardClient todos={fetchedToDos} />
    )
}
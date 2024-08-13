import { AssetsTable } from '@/components/asset-components/AssetsTable';
import { PageHeader, PageHeaderHeading } from '@/components/common/PageHeader';

export default function MyAssets() {
    return (
        <div className="min-h-screen space-y-4 my-4">
            <PageHeader>
                <PageHeaderHeading>My Assets</PageHeaderHeading>
            </PageHeader>
            <AssetsTable />
        </div>
    );
}

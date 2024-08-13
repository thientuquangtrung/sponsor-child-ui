import { PageHeader, PageHeaderHeading } from '@/components/common/PageHeader';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssetsHub() {
    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Assets Depot</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader>
            </Card>
        </>
    );
}

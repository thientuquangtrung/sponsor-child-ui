import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GiftHistoryCard from '@/components/visit/GiftHistoryCard';
import RegistrationHistoryCard from '@/components/visit/RegistrationHistoryCard';
const HistoryTabs = ({ visitId, userId }) => {
    return (
        <Tabs defaultValue="registration" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="registration">Lịch sử đăng ký</TabsTrigger>
                <TabsTrigger value="gifts">Lịch sử tặng quà</TabsTrigger>
            </TabsList>
            <TabsContent value="registration">
                <RegistrationHistoryCard visitId={visitId} userId={userId} />
            </TabsContent>
            <TabsContent value="gifts">
                <GiftHistoryCard visitId={visitId} userId={userId} />
            </TabsContent>
        </Tabs>
    );
};

export default HistoryTabs;
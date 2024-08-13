import { Switch } from '@/components/ui/switch';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function AddAssetForm({ form }) {
    return (
        <div className="space-y-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Asset name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What kind of data is it?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="3DT">3D Tiles</SelectItem>
                                <SelectItem value="CLIP">Clip</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="is_downloadable"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel>Make available for download</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}

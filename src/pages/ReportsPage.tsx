import { Download, Calendar } from 'lucide-react';
import { Button } from 'shared-lib';
import { Card, CardContent, CardHeader, CardTitle } from 'shared-lib';
import { PageHeader, ProgressBar } from 'shared-lib';
import { Popover, PopoverContent, PopoverTrigger } from 'shared-lib';
import { Calendar as CalendarComponent } from 'shared-lib';
import { useState } from 'react';
import { format } from 'date-fns';
import type {DateRange} from 'react-day-picker';
import { cn } from 'shared-lib';
import { useTranslation } from 'react-i18next';
import {useModuleLifecycle} from "../useModuleLifecycle.ts";

const deliveryMetrics = [
    { label: 'Delivery Rate', value: 98.5 },
    { label: 'Open Rate', value: 72.3 },
];

const channelData = [
    { channel: 'SMS', count: 5432 },
    { channel: 'Email', count: 3210 },
    { channel: 'App', count: 300 },
];

export default function ReportsPage() {
    const { t } = useTranslation();
    const { on } = useModuleLifecycle('reports');

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
    });

    useEffect(() => {
        const unsubscribe = on('dashboard:filter:changed', (data) => {
            if (data.type === 'dateRange' && data.value) {
                // Example: data.value = { from: Date, to: Date }
                setDate({
                    from: new Date(data.value.from),
                    to: new Date(data.value.to),
                });
            }
        });

        return unsubscribe;
    }, [on]);


    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title={t('reports.title')}
                description={t('reports.subtitle')}
                actions={
                    <>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="hover:glow-primary">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                                            </>
                                        ) : (
                                            format(date.from, "MMM dd, yyyy")
                                        )
                                    ) : (
                                        <span>{t('reports.selectDateRange')}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 glass-card border-glass-border bg-card z-[60]" align="end">
                                <CalendarComponent
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    className={cn("p-3 pointer-events-auto")}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button className="hover:glow-primary">
                            <Download className="h-4 w-4 mr-2" />
                            {t('reports.export')}
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">{t('reports.messageDelivery')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {deliveryMetrics.map((metric) => (
                            <ProgressBar
                                key={metric.label}
                                label={metric.label}
                                value={metric.value}
                                maxValue={100}
                                color={metric.label === 'Delivery Rate' ? 'bg-primary' : 'bg-secondary'}
                            />
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">{t('reports.channelPerformance')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {channelData.map((item) => (
                                <div key={item.channel} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-foreground font-medium">{item.channel}</span>
                                    <span className="text-primary font-bold">{item.count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

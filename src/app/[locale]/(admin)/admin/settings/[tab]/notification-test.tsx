'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

export function NotificationTest() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('admin.settings.edit.test_notification');

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/notification-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t('success'), {
          description: result.message || t('success_description'),
        });
      } else {
        toast.error('Test failed', {
          description: result.error || 'Unknown error',
        });
      }
    } catch (error) {
      toast.error('Test failed', {
        description: error instanceof Error ? error.message : 'Network error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-lg border p-6 md:max-w-xl">
      <h3 className="mb-2 text-lg font-medium">{t('title')}</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {t('description')}
      </p>
      <Button
        onClick={handleTest}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('sending')}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t('button')}
          </>
        )}
      </Button>
    </div>
  );
}

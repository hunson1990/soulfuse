import { NextRequest, NextResponse } from 'next/server';
import { getSignUser } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';
import { notifyAdmin } from '@/lib/notifier';
import { PERMISSIONS } from '@/core/rbac';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getSignUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has settings write permission
    const hasAccess = await hasPermission(user.id, PERMISSIONS.SETTINGS_WRITE);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden - Settings permission required' },
        { status: 403 }
      );
    }

    // Send test notification
    notifyAdmin('payment', {
      email: user.email || 'test@example.com',
      userId: user.id,
      amount: 100,
      currency: 'USD',
      planName: 'Test Plan',
      productName: 'Test Product',
      orderNo: `TEST-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Test notifications sent to DingTalk and Lark (if configured)',
    });
  } catch (error) {
    console.error('[Notification Test] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';

/** Calculate the true solar time shichen branch (0-11) from Beijing time + longitude */
/** Tính chi giờ (0-11) theo giờ Mặt Trời thực từ giờ Bắc Kinh + kinh độ */
export function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

/** BirthFormState → BirthInfo
 * Chuyển BirthFormState → BirthInfo
 *
 * Zi Shi (midnight hour) rule (Ni Haixia system / San He school standard):
 * Quy tắc giờ Tý (Ni Haixia hệ phái / chuẩn phái Tam Hợp):
 * · 23:00–23:59 = late Zi Shi → chart is calculated as **the next day** (date +1)
 * · 23:00–23:59 = Tý muộn (dạ Tý) → lá số tính theo **ngày hôm sau** (ngày +1)
 * · 00:00–00:59 = early Zi Shi → chart is calculated as the same day
 * · 00:00–00:59 = Tý sớm (tảo Tý) → lá số tính theo ngày hiện tại
 * Both periods share the same branch index (子, 0) but must be distinguished by date.
 * Cả hai khoảng đều dùng chung chỉ số chi (子, 0) nhưng phải phân biệt bằng ngày.
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;

  // Late Zi Shi (23:00–23:59): advance date by one day; Date object handles month/year rollover
  // Tý muộn (23:00–23:59): tăng ngày lên 1; đối tượng Date tự xử lý việc chuyển tháng/năm
  if (!form.unknownTime) {
    const clockHour = parseInt(form.clockHour) || 0;
    if (clockHour === 23 && y > 0 && m > 0 && d > 0) {
      const next = new Date(y, m - 1, d + 1);
      y = next.getFullYear();
      m = next.getMonth() + 1;
      d = next.getDate();
    }
  }

  const hour = form.unknownTime
    ? 0
    : calcTrueSolarBranch(parseInt(form.clockHour) || 0, parseInt(form.clockMinute) || 0, form.longitude);
  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
}

/** BirthFormState → URLSearchParams (for share links) */
/** Chuyển BirthFormState → URLSearchParams (dùng cho liên kết chia sẻ) */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 120) p.set('lo', String(form.longitude));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>; returns null if required fields are missing */
/** Chuyển URLSearchParams → Partial<BirthFormState>; trả về null nếu thiếu trường bắt buộc */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || '120'),
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}

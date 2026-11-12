import { Vela } from '../types/radar';
import { parseVelaClass, parseTimeString } from '../utils/aviatorMath';

export function generateSeedVelas(): Vela[] {
  // Use today's date formatted
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const datePrefix = `${yyyy}-${mm}-${dd}`;

  // Complete authentic sequence matching Screenshot_20261109-085446.Chrome_b5e654e8.png
  const screenshotRounds = [
    // Row 1
    { mult: 3.48, time: '08:19:42', id: 4852500 },
    { mult: 1.04, time: '08:19:31', id: 4852499 },
    { mult: 1.57, time: '08:19:19', id: 4852498 },
    { mult: 2.32, time: '08:18:52', id: 4852497 },
    { mult: 5.15, time: '08:18:43', id: 4852496 },
    { mult: 4.52, time: '08:18:36', id: 4852495 },
    { mult: 5.04, time: '08:18:27', id: 4852494 },
    { mult: 3.42, time: '08:18:11', id: 4852493 },

    // Row 2
    { mult: 1.00, time: '08:18:07', id: 4852492 },
    { mult: 2.99, time: '08:18:02', id: 4852491 },
    { mult: 1.01, time: '08:17:59', id: 4852490 },
    { mult: 1.22, time: '08:17:52', id: 4852489 },
    { mult: 1.65, time: '08:17:44', id: 4852488 },
    { mult: 1.03, time: '08:14:35', id: 4852487 },
    { mult: 1.29, time: '08:14:20', id: 4852486 },
    { mult: 1.00, time: '08:13:31', id: 4852485 },

    // Row 3
    { mult: 15.17, time: '08:13:30', id: 4852484 },
    { mult: 1.12, time: '08:13:17', id: 4852483 },
    { mult: 1.31, time: '08:13:02', id: 4852482 },
    { mult: 1.15, time: '08:12:55', id: 4852481 },
    { mult: 84.35, time: '08:12:53', id: 4852480 },
    { mult: 2.19, time: '08:12:28', id: 4852479 },
    { mult: 4.14, time: '08:10:28', id: 4852478 },
    { mult: 2.04, time: '08:10:06', id: 4852477 },

    // Row 4
    { mult: 1.81, time: '08:09:47', id: 4852476 },
    { mult: 1.88, time: '08:09:27', id: 4852475 },
    { mult: 1.98, time: '08:09:06', id: 4852474 },
    { mult: 6.32, time: '08:08:28', id: 4852473 },
    { mult: 1.55, time: '08:08:11', id: 4852472 },
    { mult: 4.40, time: '08:07:38', id: 4852471 },
    { mult: 11.86, time: '08:06:51', id: 4852470 },
    { mult: 2.07, time: '08:06:30', id: 4852469 },

    // Row 5
    { mult: 4.23, time: '08:05:58', id: 4852468 },
    { mult: 1.10, time: '08:05:45', id: 4852467 },
    { mult: 1.05, time: '08:05:34', id: 4852466 },
    { mult: 2.56, time: '08:05:09', id: 4852465 },
    { mult: 3.92, time: '08:04:38', id: 4852464 },
    { mult: 1.06, time: '08:04:26', id: 4852463 },
    { mult: 1.27, time: '08:04:11', id: 4852462 },
    { mult: 1.70, time: '08:03:53', id: 4852461 },

    // Row 6
    { mult: 59.07, time: '08:02:43', id: 4852460 },
    { mult: 1.53, time: '08:02:26', id: 4852459 },
    { mult: 1.28, time: '08:02:11', id: 4852458 },
    { mult: 15.49, time: '08:01:20', id: 4852457 },
    { mult: 4.42, time: '08:00:48', id: 4852456 },
    { mult: 97.54, time: '07:59:31', id: 4852455 },
    { mult: 4.10, time: '07:58:59', id: 4852454 },
    { mult: 1.00, time: '07:58:48', id: 4852453 },

    // Row 7
    { mult: 1.07, time: '07:58:36', id: 4852452 },
    { mult: 2.53, time: '07:58:11', id: 4852451 },
    { mult: 2.69, time: '07:57:46', id: 4852450 },
    { mult: 1.46, time: '07:57:29', id: 4852449 },
    { mult: 1.98, time: '07:57:08', id: 4852448 },
    { mult: 1.72, time: '07:56:49', id: 4852447 },
    { mult: 14.19, time: '07:56:00', id: 4852446 },
    { mult: 4.51, time: '07:55:27', id: 4852445 },

    // Row 8
    { mult: 1.26, time: '07:55:12', id: 4852444 },
    { mult: 1.37, time: '07:54:57', id: 4852443 },
    { mult: 1.37, time: '07:54:41', id: 4852442 },
    { mult: 1.24, time: '07:54:27', id: 4852441 },
    { mult: 3.25, time: '07:53:59', id: 4852440 },
    { mult: 1.03, time: '07:53:47', id: 4852439 },
    { mult: 1.21, time: '07:53:33', id: 4852438 },
    { mult: 2.61, time: '07:53:08', id: 4852437 },

    // Row 9
    { mult: 1.00, time: '07:52:57', id: 4852436 },
    { mult: 3.69, time: '07:52:27', id: 4852435 },
    { mult: 1.62, time: '07:52:09', id: 4852434 },
    { mult: 1.00, time: '07:51:58', id: 4852433 },
    { mult: 2.11, time: '07:51:36', id: 4852432 },
    { mult: 1.00, time: '07:51:25', id: 4852431 },
    { mult: 1.07, time: '07:51:13', id: 4852430 },
    { mult: 1.23, time: '07:50:59', id: 4852429 },

    // Row 10
    { mult: 2.61, time: '07:50:34', id: 4852428 },
    { mult: 1.77, time: '07:50:15', id: 4852427 },
    { mult: 1.81, time: '07:49:55', id: 4852426 },
    { mult: 94.72, time: '07:48:39', id: 4852425 },
    { mult: 2.25, time: '07:48:16', id: 4852424 },
    { mult: 4.01, time: '07:47:45', id: 4852423 },
    { mult: 2.38, time: '07:47:21', id: 4852422 },
    { mult: 3.19, time: '07:46:53', id: 4852421 },

    // Row 11
    { mult: 1.72, time: '07:46:34', id: 4852420 },
    { mult: 1.26, time: '07:46:20', id: 4852419 },
    { mult: 2.76, time: '07:45:54', id: 4852418 },
    { mult: 1.69, time: '07:45:35', id: 4852417 },
    { mult: 1.14, time: '07:45:23', id: 4852416 },
    { mult: 3.13, time: '07:44:55', id: 4852415 },
    { mult: 1.04, time: '07:44:43', id: 4852414 },
    { mult: 5.74, time: '07:44:07', id: 4852413 },

    // Row 12
    { mult: 2.00, time: '07:43:46', id: 4852412 },
    { mult: 1.00, time: '07:43:35', id: 4852411 },
    { mult: 3.29, time: '07:43:06', id: 4852410 },
    { mult: 2.71, time: '07:42:41', id: 4852409 },
    { mult: 1.03, time: '07:42:29', id: 4852408 },
    { mult: 1.75, time: '07:42:10', id: 4852407 },
    { mult: 1.17, time: '07:41:57', id: 4852406 },
    { mult: 3.08, time: '07:41:29', id: 4852405 },

    // Row 13
    { mult: 2.85, time: '07:41:03', id: 4852404 },
    { mult: 1.13, time: '07:40:50', id: 4852403 },
    { mult: 1.06, time: '07:40:39', id: 4852402 },
    { mult: 4.95, time: '07:40:04', id: 4852401 },
    { mult: 2.28, time: '07:39:41', id: 4852400 },
    { mult: 1.07, time: '07:39:29', id: 4852399 },
    { mult: 3.63, time: '07:39:00', id: 4852398 },
    { mult: 1.64, time: '07:38:41', id: 4852397 },

    // Row 14 - Mega Velas
    { mult: 5.86, time: '07:38:05', id: 4852396 },
    { mult: 4.69, time: '07:37:31', id: 4852395 },
    { mult: 4.54, time: '07:35:19', id: 4852394 },
    { mult: 2.08, time: '07:33:50', id: 4852393 },
    { mult: 3.85, time: '07:33:20', id: 4852392 },
    { mult: 3.76, time: '07:32:50', id: 4852391 },
    { mult: 2.13, time: '07:32:28', id: 4852390 },
    { mult: 1.11, time: '07:32:15', id: 4852389 },

    // Row 15
    { mult: 1.39, time: '07:31:59', id: 4852388 },
    { mult: 24.32, time: '07:31:02', id: 4852387 },
    { mult: 1.04, time: '07:30:51', id: 4852386 },
    { mult: 2.39, time: '07:30:27', id: 4852385 },
    { mult: 14.76, time: '07:29:37', id: 4852384 },
    { mult: 1.17, time: '07:29:23', id: 4852383 },
    { mult: 1.26, time: '07:29:09', id: 4852382 },
    { mult: 1.05, time: '07:28:57', id: 4852381 },

    // Row 16
    { mult: 1.77, time: '07:28:38', id: 4852380 },
    { mult: 21.07, time: '07:27:43', id: 4852379 },
    { mult: 1.12, time: '07:27:31', id: 4852378 },
    { mult: 1.15, time: '07:27:30', id: 4852377 },
    { mult: 1.11, time: '07:27:17', id: 4852376 },
    { mult: 3.95, time: '07:26:46', id: 4852375 },
    { mult: 1.00, time: '07:26:35', id: 4852374 },
    { mult: 1.20, time: '07:26:17', id: 4852373 },

    // Row 17
    { mult: 1.18, time: '07:26:09', id: 4852372 },
    { mult: 2.96, time: '07:25:45', id: 4852371 },
    { mult: 1.33, time: '07:25:42', id: 4852370 },
    { mult: 2.41, time: '07:25:40', id: 4852369 },
    { mult: 1.06, time: '07:25:37', id: 4852368 },
    { mult: 1.82, time: '07:25:35', id: 4852367 },
    { mult: 43.22, time: '07:25:30', id: 4852366 },
    { mult: 1.17, time: '07:25:28', id: 4852365 },
  ];

  return screenshotRounds.map((r) => {
    const t = `${datePrefix} ${r.time}`;
    const parsed = parseTimeString(t);
    return {
      id: r.id,
      mult: r.mult,
      class: parseVelaClass(r.mult),
      t,
      rodada: r.id,
      timeFormatted: parsed.formatted,
      dateTimeFormatted: `09/11 ${r.time}`,
      hora: parsed.hora,
      minuto: parsed.minuto,
      segundo: parsed.segundo,
    };
  });
}

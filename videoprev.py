from datetime import timedelta
import cv2
import numpy as np
import os
import sys
from PIL import Image
from heic2png import HEIC2PNG

pathfile = os.path.abspath(os.curdir)+"/static/storeg"

# то есть, если видео длительностью 30 секунд, сохраняется 10 кадров в секунду = всего сохраняется 300 кадров
SAVING_FRAMES_PER_SECOND = 10
def format_timedelta(td):
    """Служебная функция для классного форматирования объектов timedelta (например, 00:00:20.05)
    исключая микросекунды и сохраняя миллисекунды"""
    result = str(td)
    try:
        result, ms = result.split(".")
    except ValueError:
        return "-" + result + ".00".replace(":", "-")
    ms = int(ms)
    ms = round(ms / 1e4)
    return f"-{result}.{ms:02}".replace(":", "-")
def get_saving_frames_durations(cap, saving_fps):
    """Функция, которая возвращает список длительностей сохраняемых кадров"""
    s = []
    # получаем длительность клипа, разделив количество кадров на количество кадров в секунду
    clip_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
    # используем np.arange() для выполнения шагов с плавающей запятой
    for i in np.arange(0, clip_duration, 1 / saving_fps):
        s.append(i)
    return s
def main(video_file):
    filename, _ = os.path.splitext(video_file)
    filename += "-opencv"
    # создаем папку по названию видео файла
    #print(video_file)
    #print(filename)
    if not os.path.isdir(filename):
        os.mkdir(filename)
    # читать видео файл    
    cap = cv2.VideoCapture(video_file)
    # получить FPS видео
    fps = cap.get(cv2.CAP_PROP_FPS)
    # если наше SAVING_FRAMES_PER_SECOND больше FPS видео, то установливаем минимальное
    saving_frames_per_second = min(fps, SAVING_FRAMES_PER_SECOND)
    # получить список длительностей кадров для сохранения
    saving_frames_durations = get_saving_frames_durations(cap, saving_frames_per_second)
    # начало цикла
    count = 0
    save_count = 0
    while True:
        is_read, frame = cap.read()
        if not is_read:
            # выйти из цикла, если нет фреймов для чтения
            break
        # получаем длительность, разделив текущее количество кадров на FPS
        frame_duration = count / fps
        try:
            # получить самую первоначальную длительность для сохранения
            closest_duration = saving_frames_durations[0]
        except IndexError:
            # список пуст, все кадры сохранены
            break
        
        if frame_duration >= closest_duration:
            # если ближайшая длительность меньше или равна длительности текущего кадра,
            # сохраняем фрейм
            frame_duration_formatted = format_timedelta(timedelta(seconds=frame_duration))
            saveframe_name = os.path.join(filename, f"frame.jpg")
            cv2.imwrite(saveframe_name, frame)
            save_count += 1
            #print(f"{saveframe_name} сохранён")
            # удалить текущую длительность из списка, так как этот кадр уже сохранен
            try:
                saving_frames_durations.pop(0)
                im = Image.open(filename+"/frame.jpg")
                size=(100,100)
                out = im.resize(size)
                out.save(filename+"/frame.jpg")

                sys.exit(1)
            except IndexError:
                pass
            
        # увеличить счечик кадров count
        
        count = 1
    
        
    #print(f"Итого сохранено кадров {save_count}")
if __name__ == "__main__":
    import sys
    video_file = sys.argv[1]
    import time
    begtime = time.perf_counter()
    main(video_file)
    endtime = time.perf_counter()

    sys.exit(1)

    #print(f"\nЗатрачено, с: {endtime - begtime} ")

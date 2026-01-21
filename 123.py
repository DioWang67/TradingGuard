import os
import glob
import traceback # 用來顯示詳細錯誤原因

def process_vec():
    # 設定輸出資料夾
    output_folder = "new"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"[*] 已建立資料夾: {output_folder}")

    # 搜尋 .vec 檔案
    vec_files = glob.glob("*.vec")
    if not vec_files:
        print("[!] 錯誤：沒看到 .vec 檔案！請確認這支程式和 .vec 放在同一個位置。")
        return

    for file_path in vec_files:
        print(f"[*] 正在處理: {file_path}")
        new_lines = []
        target_pos = None

        # 讀取檔案 (嘗試 utf-8，若失敗則忽略錯誤字元)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()

        # 第一遍：找對齊基準 (ADV)
        for line in lines:
            if "ADV" in line and "%" in line and not line.lstrip().startswith(";"):
                prefix = line.split("%")[0].rstrip()
                target_pos = len(prefix) + 13
                print(f"    -> 找到基準 ADV，% 將對齊至第 {target_pos + 1} 個字元位置")
                break
        
        if target_pos is None:
            print(f"    [?] 跳過：{file_path} 內容中找不到 'ADV'，無法對齊。")
            continue

        # 第二遍：開始對齊
        for line in lines:
            if "%" in line and not line.lstrip().startswith(";"):
                parts = line.split("%", 1)
                cmd_part = parts[0].rstrip()
                remain_part = parts[1]
                
                padding = target_pos - len(cmd_part)
                if padding < 1:
                    padding = 1
                
                new_line = cmd_part + (" " * padding) + "%" + remain_part
                new_lines.append(new_line)
            else:
                new_lines.append(line)

        # 寫入檔案
        output_path = os.path.join(output_folder, file_path)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"    [V] 完成！已存至 {output_path}")

if __name__ == "__main__":
    try:
        print("="*40)
        print(" VEC 檔案格式對齊工具 (防閃退版)")
        print("="*40)
        
        process_vec()

    except Exception:
        print("\n" + "!"*40)
        print("發生錯誤 (CRITICAL ERROR)")
        print("!"*40)
        traceback.print_exc()
    
    print("\n" + "="*40)
    input("程式執行結束。請按 Enter 鍵關閉視窗...")
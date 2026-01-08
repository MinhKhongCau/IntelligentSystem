# This is file test for test feature adaptive threshold
import yaml
# import numpy as np
from Intelligent.utils.utils import updatedThreshold, adaptiveThreshold 

def run_yaml_tests(file_path):
    with open(file_path, 'r') as f:
        data = yaml.safe_load(f)

    print(f"--- ĐANG CHẠY TEST TỪ FILE: {file_path} ---")

    # 1. Test updatedThreshold
    print("\n[PART 1] Testing updatedThreshold...")
    for case in data.get('test_updated_threshold', []):
        result = updatedThreshold(
            case['old_embedding'], 
            case['new_embedding'], 
            case['old_threshold']
        )
        
        passed = case['expected_min'] <= result <= case['expected_max']
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} | {case['name']}: Result={result:.4f}")

    # 2. Test adaptiveThreshold
    print("\n[PART 2] Testing adaptiveThreshold...")
    for case in data.get('test_adaptive_threshold', []):
        updated_list, new_thresh = adaptiveThreshold(
            case['old_data'], 
            case['new_embedding']
        )
        
        passed = abs(new_thresh - case['expected_new_threshold']) < 1e-5
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} | {case['name']}: New Threshold={new_thresh:.4f}")

if __name__ == "__main__":
    run_yaml_tests('TestCaseUpdatedThreshold.yaml')
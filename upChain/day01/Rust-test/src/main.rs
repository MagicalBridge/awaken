
use std::time::Instant;
use sha2::{Digest, Sha256};

#[allow(unused_assignments)]
fn main() {
    // 声明自己的昵称
    let my_nickname = b"MagicalBridge";
    let mut nonce = 0;
    let mut hash = String::new();

    // 记录开始时间
    let start_time = Instant::now();

    loop {
        let data = format!("{}{}", String::from_utf8_lossy(my_nickname), nonce);
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        let result = hasher.finalize();
        hash = format!("{:x}", result);

        if hash.starts_with("0000") && hash.chars().nth(4).unwrap() != '0' {
            break;
        }

        nonce += 1;
    }

    // 记录结束时间
    let end_time = Instant::now();

    // 计算运行时间（毫秒）
    let run_time = end_time.duration_since(start_time).as_millis();

    println!("nonce: {}", nonce);
    println!("hash: {}", hash);
    println!("Run Time: {} ms", run_time);
}

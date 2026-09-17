document.addEventListener("DOMContentLoaded", () => {
  const lineBtn = document.getElementById("btn-line-register");
  const quickBtn = document.getElementById("btn-quick-register");

  const handleRegister = (method) => {
    // Save member session into localStorage
    const memberData = {
      isLoggedIn: true,
      memberId: "GG-FAN-" + Math.floor(100000 + Math.random() * 900000),
      registerMethod: method,
      nickname: method === "LINE" ? "LINEユーザー" : "ご縁サポーター",
      joinedDate: new Date().toISOString().split("T")[0],
      points: 100, // Welcome points
      rank: "レギュラー会員",
      favoriteGirl: "那須乃つつじ",
      checkinCount: 0,
      unlockedVoices: ["tsutsuji-welcome"],
      unlockedWallpapers: ["tsutsuji-spring"]
    };

    localStorage.setItem("goen_girl_member_session", JSON.stringify(memberData));

    // Show simulated modal / feedback
    alert(`🎉 ご縁ガール無料会員登録が完了しました！\n（新規入会特典：100 GOEN POINT ＋ 限定ウェルカムボイスを付与しました）\n\n会員ダッシュボードへご案内します。`);
    window.location.href = "../member/";
  };

  if (lineBtn) {
    lineBtn.addEventListener("click", () => handleRegister("LINE"));
  }
  if (quickBtn) {
    quickBtn.addEventListener("click", () => handleRegister("Email"));
  }
});

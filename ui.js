const showTitle = () => {
    const art =   "     __          ___ _               \n" +
                  "  /\\ \\ \\___     / __\\ | __ _ ___ ___ \n" +
                  " /  \\/ / _ \\   / /  | |/ _` / __/ __|\n" +
                  "/ /\\  / (_) | / /___| | (_| \\__ \\__ \\\n" +
                  "\\_\\ \\/ \\___/  \\____/|_|\\__,_|___/___/\n";
    console.log(art.rainbow);
    console.log("\n\trmidhunsuresh@gmail.com".red);
    console.log("\tv.1.0.0");
    console.log("____________________________________________________________\n");
};

const createBar = (size, title) => {
    const cliProgress = require('cli-progress');
    const bar1 = new cliProgress.SingleBar({
      format: title + ' | {bar}'.cyan + ' {percentage}%',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      barsize: 30,
      clearOnComplete:true
      }, cliProgress.Presets.shades_classic);
    bar1.start(size,0);
    return bar1;
  };

const set_bar = (bar, progress) => {
    bar && bar.update(progress);
};

const stop_bar = bar => bar.stop();


exports.showTitle = showTitle;
exports.createBar = createBar;
exports.set_bar = set_bar;
exports.stop_bar = stop_bar;
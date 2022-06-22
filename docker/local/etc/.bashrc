# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

export ARTISAN_CMDS_FILE=bootstrap/cache/artisan-cmds.txt

function _artisan() {
    COMP_WORDBREAKS=${COMP_WORDBREAKS//:}

    if [ -f "$ARTISAN_CMDS_FILE" ]; then
        COMMANDS=$(cat "$ARTISAN_CMDS_FILE")
    else
        COMMANDS=$(php artisan --raw --no-ansi list | awk '{print $1}')
    fi

    COMPREPLY=(`compgen -W "$COMMANDS" -- "${COMP_WORDS[COMP_CWORD]}"`)

    return 0
}

function art_cache() {
    if [[ "$1" == "clear" ]]; then
        echo -n "Removing commands cache file..."
        rm -f "$ARTISAN_CMDS_FILE"
        echo "done."
    else
        php artisan --raw --no-ansi list | awk '{print $1}' > "$ARTISAN_CMDS_FILE"
        echo $(wc -l "$ARTISAN_CMDS_FILE" | awk '{print $1}')" artisan commands cached."
    fi
}

complete -o default -F _artisan artisan

# environment
export EDITOR=mcedit
export PS1='\[\033[0;32m\]\u@\h:\[\033[36m\]\w\[\033[0m\] \$ '
